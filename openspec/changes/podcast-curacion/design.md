# Design

## Context

- El panel de admin que existe es `/admin/launchpad`. Chequea el rol con
  `getViewer()`, devuelve 404 si quien entra no es admin, y sus server actions
  usan `requireAdmin()` y `ActionResult` (`lib/launchpad/`).
- La base es Neon con Drizzle (`casing: "snake_case"`). Los schemas están en
  `lib/db/schema/` y las migraciones en `drizzle/`, y corren solas en el build.
- `lib/github.ts` ya consulta la API de GitHub con `GITHUB_TOKEN` opcional,
  que no está declarado en `lib/env.ts`.
- No hay framework de tests. Se verifica con `pnpm check`,
  `pnpm exec tsc --noEmit`, el CLI y mirando la página en el navegador.
- Las fuentes se probaron el 2026-10-26:
  - HN Algolia, arXiv (Atom) y los feeds de Substack responden.
  - El RSS por materia de bioRxiv (`connect.biorxiv.org/biorxiv_xml/…`)
    devuelve 404.
  - La API de bioRxiv (`api.biorxiv.org/details/biorxiv/{desde}/{hasta}/{cursor}?category=…`)
    filtra por categoría y pagina de a 30 resultados. En una semana,
    bioinformatics trae unos 220.
  - `alquimia-hq` es una cuenta de usuario. Hoy no tiene stars.

## Goals / Non-Goals

**Goals:**

- La lógica de curación no depende de Next: la usan tanto la server action
  como el CLI.
- Agregar una fuente nueva implica una función y una entrada en la config.
  No hace falta tocar el pipeline.

**Non-Goals:**

- Que el ranking sea "inteligente". Las fuentes sin señal (arXiv, bioRxiv,
  RSS) se ordenan por fecha. Ver Riesgos.
- Ejecución en segundo plano o en una cola: la corrida es sincrónica.
- Editar los parámetros desde la UI.

## Decisions

### Estructura

```
lib/podcast/curation/
  config.ts        # CURATION_CONFIG: único lugar con parámetros
  types.ts         # SourceItem, Candidate, SourceResult
  url.ts           # normalizeUrl()
  sources/         # hn.ts, github-stars.ts, arxiv.ts, biorxiv.ts, rss.ts
  pipeline.ts      # collect → dedupe → excluir top previos → rankear (puro)
  run.ts           # orquesta: ventana desde la base, pipeline, guarda
  actions.ts       # "use server": runCuration() con requireAdmin()
  queries.ts       # última corrida y sus candidatos
scripts/podcast-curation.ts   # CLI, corre con tsx
```

`pipeline.ts` no toca la base ni usa `server-only`. `run.ts` recibe la base
como dependencia, así el CLI con `--dry-run` usa el pipeline sin persistir.

### Configuración en un archivo TypeScript tipado

`CURATION_CONFIG` define:

- `defaultWindowDays`: 7.
- `topSize`: 10.
- `sourceTimeoutMs`: 15000.
- `sources`: un array **ordenado por prioridad**. Cada entrada tiene
  `id`, `enabled`, `quota` (tope en el top), `maxCandidates` (cuántos guarda
  como máximo) y los parámetros de su tipo:

| Fuente | Parámetros | Señal | Tope inicial |
|---|---|---|---|
| `hn` | `minPoints: 50` | puntos | 4 |
| `github` | `user: "alquimia-hq"` | estrellas del repo | 4 |
| `arxiv` | `categories: [cs.AI, cs.LG, cs.CL, cs.CR, cs.HC]` | — (fecha) | 2 |
| `biorxiv` | `categories: [bioinformatics, synthetic biology, genomics]` | — (fecha) | 2 |
| `newsletters` | `feeds: [latent.space, importai, oneusefulthing, interconnects]` | — (fecha) | 3 |

Se valida con zod al cargar el módulo, así un error de config rompe
`tsc` o el arranque, no una corrida a medias.

Alternativas descartadas:
- **JSON o YAML.** Pierde tipos y autocompletado.
- **Tabla en la base editable desde la UI.** Hoy es más de lo que hace falta.
  Se puede sumar después sin cambiar la spec de parámetros.

### Ranking: round-robin por prioridad con topes

Cada fuente ordena sus candidatos por señal descendente o, si no tiene señal,
por fecha descendente. El top se arma recorriendo las fuentes en orden de
prioridad y tomando el siguiente candidato de cada una, salteando las que ya
llegaron a su `quota` o se quedaron sin candidatos, hasta llegar a `topSize`.

Es determinístico y fácil de explicar, y no compara señales que no se pueden
comparar entre fuentes (puntos de HN contra estrellas). Se descartó
normalizar las señales a percentiles: agrega complejidad sin mejorar mucho el
resultado mientras tres de las cinco fuentes no tienen señal.

### Normalización de URL

- Fuerza `https`, pasa el host a minúsculas y le saca `www.`.
- Saca el fragmento, los parámetros `utm_*`, `ref` y `source`, y la barra
  final.
- arXiv se lleva a `arxiv.org/abs/<id>`, sin versión.
- GitHub se lleva a `github.com/<owner>/<repo>`, en minúsculas.

Para las Ask/Show HN sin URL se usa la URL del ítem en HN.

### Fuentes

- **HN:** `hn.algolia.com/api/v1/search` con `tags=story` y
  `numericFilters=created_at_i>…,points>=minPoints`, sin paginar (hasta
  `maxCandidates`).
- **GitHub:** `users/<user>/starred` con `Accept: application/vnd.github.star+json`
  para obtener `starred_at`, ordenado por `created` descendente. Se pagina
  hasta salir de la ventana.
- **arXiv:** `export.arxiv.org/api/query` con
  `cat:A OR cat:B…`, ordenado por `submittedDate` descendente. Corta al salir
  de la ventana.
- **bioRxiv:** la API `details` con `?category=` para cada categoría (se usa
  la API porque el RSS ya no existe). La API devuelve los más viejos primero,
  así que pagina hacia atrás desde la última página hasta llegar a
  `maxCandidates`. Solo informa el día, así que la ventana se compara por día:
  si se corre dos veces el mismo día, los papers de ese día pueden volver a
  aparecer, salvo los que ya estuvieron en un top.
- **RSS:** todos los feeds de la entrada en paralelo, filtrados por
  `pubDate`.

Para el Atom de arXiv y para RSS se suma `fast-xml-parser`, que no tiene
dependencias.

Cada fuente corre con `AbortSignal.timeout(sourceTimeoutMs)` dentro de un
`Promise.allSettled`, así la falla de una no corta a las demás.

### Modelo de datos

```
podcast_curation_run
  id text pk, status enum(running|completed|failed),
  window_start, window_end timestamptz,
  triggered_by text → user.id (null si vino del CLI),
  source_errors jsonb  -- [{ source, message }]
  created_at, finished_at

podcast_candidate
  id text pk, run_id → podcast_curation_run (cascade),
  source text, url text (normalizada), title text,
  published_at timestamptz, signal integer null,
  top_position integer null, metadata jsonb  -- autores, link a comentarios de HN, etc.
  unique (run_id, url), index (url) para excluir tops previos
```

La ventana de la próxima corrida es `window_end` de la última corrida con
`completed`. Una corrida en la que fallaron todas las fuentes queda en
`failed` y no mueve la ventana.

Los nombres llevan el prefijo `podcast_` para no chocar con tablas futuras de
otras áreas. `source` es `text` y no un enum, porque las fuentes cambian
desde la config y no conviene que cada cambio pida una migración.

### Ejecución en Vercel

`curateCandidates()` es una server action (para no chocar con `runCuration()`
de `run.ts`, que también usa el CLI) que llama a `requireAdmin()`, corre todo
sincrónicamente y hace `revalidatePath("/admin/podcast")`. La página exporta
`maxDuration = 60`. Con timeouts de 15 s por fuente y las fuentes en
paralelo, una corrida debería tardar menos de 20 s.

La alternativa era `after()` o una ruta en segundo plano con polling.
Hoy no hace falta.

### UI

- `/admin/podcast` copia la estructura de `/admin/launchpad`: `SiteHeader`, el
  manejo de sesión y el 404.
- La página muestra:
  - un encabezado con la ventana y la fecha de la última corrida;
  - el botón **Curar** (client component con `useTransition` y toast de
    resultado);
  - un aviso si fallaron fuentes;
  - una tabla del top con posición, título enlazado, fuente, señal y fecha;
  - debajo, colapsado, el resto de los candidatos.
- Los textos van en un namespace `PodcastAdmin`, en `es` y `en`.
- Se suma un link al panel del podcast junto al de `adminPanel` en
  `components/auth/user-menu.tsx` y en `/account`.

### CLI

`pnpm podcast:curation [--dry-run] [--days N]` corre
`tsx --env-file=.env.local scripts/podcast-curation.ts`. `--days` pisa la
ventana calculada, y se usa solo para probar. Sin `--dry-run` escribe en la
base de `.env.local`, que en desarrollo es la base local o la branch `dev`
de Neon.

## Risks / Trade-offs

- **[arXiv y bioRxiv sin señal ordenan por fecha, así que el top de esas
  fuentes es casi arbitrario]** → Tienen topes bajos (2) y la tabla del
  resto de los candidatos queda a la vista. El ranking con IA, que quedó fuera
  de alcance, es la mejora natural.
- **[Las stars de `alquimia-hq` arrancan vacías]** → La fuente no aporta nada
  hasta que alguien marque repos. No es un error.
- **[Rate limit de GitHub sin token: 60 req/h]** → Una corrida hace 1 o 2
  requests. Si `GITHUB_TOKEN` está, se usa.
- **[Dos admins aprietan Curar al mismo tiempo]** → Las dos corridas calculan
  la misma ventana y producen tops parecidos. No se pierde nada, así que no
  se bloquea.
- **[Una corrida se corta en Vercel y queda en `running`]** → No mueve la
  ventana porque solo cuentan las `completed`. La página la muestra como
  incompleta.
- **[Cambian las APIs externas, como ya pasó con el RSS de bioRxiv]** → La
  falla queda aislada a esa fuente y visible en la página.

## Migration Plan

- La migración agrega dos tablas y un enum, sin tocar las existentes. Corre
  en el build del preview y de producción.
- Para hacer rollback se revierte el PR. Las tablas pueden quedar sin uso o
  borrarse con una migración nueva.
