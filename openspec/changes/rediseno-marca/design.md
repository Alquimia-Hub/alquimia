# Design

## Context

Los colores y las fuentes viven en `app/globals.css` (tokens `--bg`, `--ink`,
`--gold`, `--elixir`, etc., mapeados a Tailwind con `@theme inline`) y en
`app/[locale]/layout.tsx`, que carga cuatro familias con `next/font/google`.
Pero unos 40 archivos no usan los tokens de familia: escriben
`font-[family-name:var(--font-cormorant)]` y similares, así que cambiar solo el
tema no alcanza. La landing está armada con componentes de servidor
(`LaunchpadSection`, `ReposSection` leen la base y GitHub) más algunos de
cliente (`CommunityCta` con partículas, `ScrollReveal`, carruseles). La
propuesta visual y las mediciones del sitio actual están en el artifact
enlazado en `proposal.md`; los requisitos, en `specs/`.

## Goals / Non-Goals

**Goals:**
- Que el cambio de letra y color se haga en un solo lugar y que ninguna pantalla
  quede con una fuente que ya no se carga.
- Hero con dos imágenes grandes que no castigue el LCP.
- Movimiento solo con `transform` y `opacity`, con salida para movimiento
  reducido y sin depender del script para verse completo.

**Non-Goals:**
- Rediseñar el layout del Launchpad, `/brand`, OG o mails.
- Agregar librerías de animación (Framer Motion, GSAP, Lenis).
- Consultar el widget de Discord para mostrar miembros conectados.

## Decisions

### Tokens semánticos con los nombres de siempre, valores nuevos
Se mantienen los nombres que usa todo el código (`bg`, `bg-2`, `ink`, `ink-2`,
`gold`) y se cambian sus valores a la paleta nueva: `bg` = nigredo, `ink` =
albedo, `gold` = citrinitas. Se suman `rubedo` y `albedo` (campo claro) y
`on-light` (tinta sobre campos claros). Se borran `elixir`, `elixir-2`,
`copper`, `gold-2`, `ink-4`, `rule` y `rule-2`, y cada uso se reemplaza por el
token vigente más cercano (`gold-2` → `gold`, `rule` → un escalón de tono).
*Alternativa:* renombrar todo a `nigredo`/`albedo`. Toca cientos de clases sin
cambiar nada visible; los nombres alquímicos quedan para documentación y para
`/brand`.

### Una familia, tres tokens que apuntan a Literata
`layout.tsx` carga solo Literata (variable, con eje de tamaño óptico y pesos
400, 500 y 600, con cursiva 400). `--font-sans`, `--font-serif` y
`--font-display` apuntan a ella; `--font-mono` queda solo para `<code>`. Todas
las clases `font-[family-name:var(--font-…)]` se reemplazan por `font-sans` o
`font-display`, y se borran las variables `--font-cormorant`,
`--font-eb-garamond`, `--font-im-fell` y `--font-jetbrains`. Un `grep` de esos
nombres tiene que dar cero al final.
*Alternativa:* redefinir `--font-cormorant` para que apunte a Literata. Deja
nombres que mienten y no limpia los tamaños ni las versalitas que van pegados.

### Escala como utilidades de Tailwind
Cinco pasos como variables en `@theme` (`--text-note`, `--text-body`,
`--text-lead`, `--text-title`, `--text-display`, con `clamp`) para usar
`text-body`, `text-title`, etc. Las clases `text-[11px]`, `text-[13px]`,
`tracking-[0.3em]`, `uppercase` decorativo y similares se reemplazan por esos
pasos. Las pantallas internas solo cambian tamaños que quedan bajo 14 px; su
jerarquía se revisa en la fase siguiente.

### Hero como componente de servidor con un cliente mínimo
`HeroSection` renderiza en servidor un `<picture>` con dos fuentes
(`(max-aspect-ratio: 4/5)` → vertical, si no → horizontal), el oscurecido y el
contenido. Las escenas originales van a `public/images/hero/` y las fuentes del
`<picture>` se generan con `getImageProps` de `next/image`, que optimiza cada
versión (AVIF/WebP, anchos según `sizes="100vw"`) y permite la dirección de arte
que `<Image>` solo no hace. Prioridad alta y sin `loading="lazy"`.
*Ajuste durante la implementación:* el proyecto tiene `images.unoptimized: true`
en `next.config.mjs`, así que `getImageProps` no genera AVIF ni WebP. Las
variantes se codifican una vez y se versionan en `public/images/hero/`
(`taller-{768,1152,1536}` y `taller-vertical-{512,768,1024}`, en AVIF y WebP);
`getImageProps` arma el `<img>` y el `<picture>` declara los `srcset`. Los PNG
originales quedan como fuente.
El acercamiento inicial y la entrada del texto son keyframes de CSS. La cámara
que entra por el arco es un componente cliente chico (`HeroCamera`) que en
`scroll` pasivo con `requestAnimationFrame` escribe `transform: scale()` en la
imagen y `opacity` en el contenido; no hace nada con `prefers-reduced-motion`.
*Alternativa:* `animation-timeline: view()` en CSS puro. Es la opción más
liviana pero Safari todavía no la soporta de forma estable; se puede migrar
después sin cambiar el comportamiento.

### Pieza viva sin estado en el servidor (reemplazada en la segunda vuelta)
`StagePicker` es un componente cliente con cuatro `<button aria-pressed>` y un
panel `aria-live="polite"`. El contenido de cada etapa sale de `messages` y los
destinos de `COMMUNITY_LINKS`, `SOCIAL_LINKS` y las rutas existentes. Sin
JavaScript se renderizan como links (`<a>`) a sus destinos; la hidratación los
convierte en botones. El color del panel cambia con un atributo `data-stage`.

### Componentes de sección nuevos, no adaptados
Cada sección nueva es su propio componente de servidor
(`WelcomeSection`, `PillarsSection`, `LabSection`, `LaunchpadSection`,
`ManifestoSection`, `ClosingSection`, `LandingFooter`). `LabSection` reemplaza
el carrusel de repos por una lista, reusando `fetchOrgRepos` y `localizeRepo`.
`PillarsSection` absorbe los pilares del hero y las charlas (`TALKS`,
`HeroVideoDialog`). Se borran `BackgroundEffects`, `QuoteSection`,
`SectionHeading`, `ReposCarousel`, `TalksCarousel`, `CarouselControls` y las
partículas de `CommunityCta` cuando dejen de usarse.
*Alternativa:* restilar los componentes actuales. Sus estructuras (eyebrow,
carrusel con numeración, tarjetas con borde) son justo lo que se quita.

### Entradas por sección con `ScrollReveal`
Se conserva `ScrollReveal`, pero el estado inicial pasa a ser visible y la clase
que oculta solo se aplica cuando el script corrió y el elemento está fuera de
pantalla, para que nada quede invisible sin JavaScript. Escalonado de 60 a 90 ms
entre título, texto e imagen.

### Segunda vuelta: la cámara cruza el arco
`HeroCamera` sigue siendo el único script del hero. Escucha `scroll` pasivo y
sigue el progreso del recorrido (0 a 1) con un suavizado por cuadro (16 % de
la distancia que falta), así un scroll rápido igual pasa por cada tramo. Mueve
capas del tamaño de la pantalla, nunca más grandes, y solo escribe `transform`
y `opacity`:

| Tramo | Qué pasa |
|---|---|
| 0 → 0,10 | El texto se va (y deja de recibir clicks); el oscurecido baja a 0,35 |
| 0,08 → 0,45 | El taller se acerca al arco (1 → 1,3; 1,15 en teléfonos) |
| 0,12 → 0,30 | El pasillo (*umbral*) se enciende **dentro del arco**, con una máscara con la forma del arco |
| 0,45 → 0,65 | El arco se abre más allá de la pantalla (×4,6; ×3,4 en teléfonos); el taller se agranda con él, así el arco pintado queda en el borde, y se apaga entre 0,50 y 0,62 |
| 0,62 → 0,90 | El pasillo avanza hacia el horno (1 → 1,22) |
| 0,70 → 0,92 | La luz del horno crece, dorada y suave, desde el 50 % 60 % |
| 0,88 → 0,93 | Un velo albedo deja la pantalla en el campo de la sección siguiente |

La máscara del arco es un SVG trazado sobre `taller.png` (1536 × 1024) y
`taller-vertical.png` (1024 × 1536), con `mask-size: cover` y la misma
posición que la imagen (50 % 42 %), así coincide con el arco pintado en
cualquier pantalla. El pasillo vive dentro de la puerta con una escala inversa
y el mismo origen, para que no se corra al abrirse. Al cruzar se quita la máscara. Ninguna capa del hero lleva `will-change`:
Chrome fija la escala de rasterizado al promover la capa y, con capas que
escalan hasta ~7×, al volver hacia arriba se agotaba la memoria de tiles
(partes sin pintar y títulos que titilaban). El hero mide
260 svh (240 en pantallas verticales). Sin JavaScript o con movimiento reducido no corre
nada y el hero mide una pantalla; el script escucha si esa preferencia cambia.
*Alternativa descartada:* fundir el taller con el pasillo a pantalla completa.
Las dos imágenes tienen puntos de vista distintos y se veían como doble
exposición; además, escalar el taller más de 1,5× pixela la imagen.

### Políptico de servidor, sin estado
El políptico reemplaza a `StagePicker` y vive dentro de `WelcomeSection`, que
es un componente de servidor: cuatro
`<article>` con su lámina, su glifo, un `h3`, una frase y un link. No hay
botones ni estado, así que funciona igual sin JavaScript. El color de cada
tabla sale de un atributo `data-stage` que fija `--panel-bg` y `--panel-ink`
(los mismos tokens que hoy usa `.stage-panel`). La tabla albedo usa un escalón
de tono (`albedo-2`) para separarse del campo albedo de la sección. Se borran
`StagePicker` y las clases `stage-swap`.

### Glifos como componente
`components/glyphs.tsx` exporta un `Glyph` con `name` (`saturn`, `moon`,
`sun`, `stone`, `mercury`, `fire`, `salt`) que dibuja un SVG de caja 24 × 24,
trazo 1,5 y `currentColor`, con `aria-hidden` por defecto y `title` cuando
recibe `label`. Se dibujan a mano: las fuentes de símbolos alquímicos no
existen en todos los sistemas y su trazo no combina con Literata.

### Láminas y placeholders
`scene-picture.tsx` tiene un mapa `PLATES` con cada lámina de
`docs/ilustraciones.md` (archivo y tamaño). Los PNG fuente viven en
`assets/plates/`, fuera de `public/`, y `scripts/encode-plates.mjs` (con
`sharp`, que se suma como devDependency) genera el AVIF y el WebP de
`public/images/hero/`. Mientras faltaban láminas se usaron recortes del hero
como placeholder; ya no queda ninguno. La capitular sin
lámina es la letra sola sobre `bg-3`.

### Datos de la prueba
La línea de prueba del hero cuenta los proyectos aprobados con
`countApprovedProjects()` (una consulta nueva en `lib/launchpad/queries.ts`) y
los repos curados con `fetchOrgRepos()`, que ya se cachea una hora.
`fetchOrgRepos` suma `pushed_at` como `updatedAt` para mostrar el último
cambio de cada repo, formateado con `Intl.RelativeTimeFormat` del idioma de la
ruta.

### Tipografía display
`layout.tsx` carga IM Fell English (400 normal) con `next/font/google` como
`--font-im-fell-display`, expuesta como la utilidad nueva `font-heading`. Los
títulos de la portada usan `font-heading font-normal` (IM Fell tiene un solo
peso). `font-display` sigue en Literata: lo usan títulos chicos, nombres de
proyecto y cifras de las pantallas internas, donde IM Fell se lee mal; pasarlas
a `font-heading` queda para la fase siguiente. La escala no cambia.
*Alternativa:* apuntar `--font-display` a IM Fell. Cambia de golpe unas 30
pantallas internas, incluidas cifras tabulares.

## Risks / Trade-offs

- [Las imágenes del hero pesan ~700 KB en PNG] → AVIF/WebP a la medida
  justa y prioridad alta; objetivo de LCP bajo 2,5 s en 4G simulado.
- [Las pantallas internas cambian de letra y color sin rediseño] → se revisan
  en el navegador una por una (Launchpad, detalle, formulario, mis proyectos,
  cuenta, admin, legales, marca) y se corrige cualquier texto bajo 14 px o sin
  contraste. Su layout queda para la fase siguiente.
- [El scroll con `scale` grande pixela la imagen] → el taller escala 1,5 como
  máximo y el pasillo 1,22; el resto lo hace la máscara del arco.
- [Capas enormes agotan la memoria de la GPU y dejan partes sin pintar] → todas
  las capas del hero miden lo que la pantalla y se escalan con `transform`.
- [Las láminas dependen de que el equipo las genere] → placeholders con recortes
  del hero, listados en `tasks.md`, que se reemplazan sin tocar componentes.
- [Un componente cliente por cada pieza animada] → solo `HeroCamera`,
  `StagePicker` y `ScrollReveal` son cliente; el resto es servidor.
- [Claves de traducción borradas que use otra pantalla] → `pnpm check` valida
  que `es.json` y `en.json` tengan las mismas claves, y `tsc` marca las claves
  que ya no existen.

## Migration Plan

Se mergea en un solo PR: sin cambios de base de datos ni de variables de
entorno. La preview de Vercel se revisa a 1440, 768 y 390 px antes de mergear.
Para volver atrás alcanza con revertir el merge.

## Open Questions

- Si el texto alternativo de las escenas debe nombrar cada situación o resumir
  la escena. Se puede ajustar en el copy sin cambiar nada más.
