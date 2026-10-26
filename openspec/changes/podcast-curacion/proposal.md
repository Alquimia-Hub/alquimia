# Proposal

## Why

Para elegir los temas de cada episodio de Noches de Alquimia, los cohosts hoy
recorren a mano Hacker News, GitHub, arXiv, bioRxiv y newsletters. La curación
es la primera etapa del pipeline del podcast y la que alimenta todas las demás.
Además sirve para elegir los temas del episodio 0, así que conviene tenerla
antes o en paralelo a él.

Esta primera versión es deliberadamente simple: se dispara a mano, no usa IA y
rankea con las señales que ya da cada fuente.

## What Changes

- Nueva página `/admin/podcast`, solo para admins. Tiene un botón **Curar**
  que lanza una corrida de curación y muestra el top 10 de la última corrida,
  junto con el resto de los candidatos.
- **Una corrida de curación:**
  - junta candidatos de las fuentes configuradas, dentro de una ventana que va
    desde la corrida anterior hasta ahora (7 días en la primera);
  - normaliza las URLs y deduplica por URL;
  - excluye las URLs que ya estuvieron en un top 10 anterior;
  - ordena cada fuente por su propia señal y arma el top 10 respetando un tope
    de candidatos por fuente.
- Fuentes iniciales:
  - **Hacker News**, ordenado por puntos;
  - las **stars de la cuenta `alquimia-hq`** en GitHub;
  - **arXiv**, en cs.AI, cs.LG, cs.CL, cs.CR y cs.HC;
  - **bioRxiv**, en bioinformatics, synthetic biology y genomics;
  - **newsletters por RSS**: Latent Space, Import AI, One Useful Thing e
    Interconnects.
- Todos los parámetros se configuran en un único archivo del repo: fuentes,
  categorías, feeds, cuenta de GitHub, topes por fuente, tamaño del top,
  ventana por defecto y mínimos de cada fuente.
- Cada corrida y todos sus candidatos se guardan en la base. Si una fuente
  falla, la corrida sigue con las demás y queda registrado qué fuente falló.
- `pnpm podcast:curation` corre lo mismo desde la terminal. Con `--dry-run`
  imprime el resultado sin escribir en la base, para ajustar los parámetros.
- `docs/podcast.md` y `GLOSSARY.md` se actualizan: la curación es manual,
  vive en el panel y no pasa por Discord ni por un cron.

Fuera de alcance: ranking con IA y resúmenes, Discord, cron o GitHub Actions,
X, el canal de sugerencias, la elección de temas y un rol de cohost.

## Capabilities

### New Capabilities

- `podcast-curation`: cómo se juntan, deduplican, ordenan y guardan los
  candidatos del podcast, quién puede disparar una corrida y qué ve.

### Modified Capabilities

Ninguna.

## Impact

- **Base de datos:** dos tablas nuevas, para las corridas y los candidatos,
  con su migración en `drizzle/`.
- **Código:** `lib/podcast/curation/` (config, fuentes, pipeline),
  `app/[locale]/admin/podcast/`, componentes de la página, una server action,
  un script de CLI y el link en el menú de usuario y en `/account`.
- **Textos:** claves nuevas en `messages/es.json` y `messages/en.json`.
- **Dependencias:** un parser de XML para arXiv (Atom) y para los feeds RSS.
- **Servicios externos:** APIs públicas de HN (Algolia), GitHub, arXiv y
  bioRxiv, y los feeds RSS. No hacen falta credenciales nuevas: GitHub usa
  `GITHUB_TOKEN` si está, como hoy `lib/github.ts`.
- **Docs:** `docs/podcast.md` y `GLOSSARY.md`.
