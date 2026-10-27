# Proposal

## Why

La landing se lee mal: el texto corrido mide 15 px, hay 14 tamaños y 3 serifas,
14 bloques de texto bajan de 13 px y todo va encima de una pintura oscurecida.
La ilustración actual, además, es azul y oro, la combinación que la marca evita.
El rediseño mantiene el nombre y la mística alquímica, pero hace que el sitio se
lea de corrido y que la portada sorprenda. La propuesta visual está en
https://claude.ai/artifact/Kz2ryJhHNhz1NfNGMmtwtt.

## What Changes

- **Identidad visual nueva para todo el sitio.** Una sola familia, Literata, con
  cinco tamaños y nada que se lea bajo 14 px. Paleta de las cuatro etapas de la
  Gran Obra: nigredo `#14110D` (fondo), albedo `#EDE6D6` (texto y campo claro),
  citrinitas `#E0AE45` (acción principal) y rubedo `#7E2618` (campo del
  Launchpad). Sin azul.
- **BREAKING (visual):** se quitan Cormorant Garamond, EB Garamond, IM Fell
  English SC y JetBrains Mono, y los tokens `elixir`, `copper`, `gold-2` y las
  reglas doradas. Las pantallas internas (Launchpad, cuenta, admin, legales,
  marca) toman la letra y los colores nuevos sin cambiar su layout.
- **Hero "El gran taller".** Una escena grabada a pantalla completa (versión
  horizontal y vertical) con el contenido centrado en el arco: título, una
  oración, "Entrar al Discord" y "o al grupo de WhatsApp". La escena se asienta al
  cargar y, al scrollear, la cámara entra por el arco.
- **Landing nueva, en este orden:** bienvenida "¿Por dónde arrancás?" con la
  pieza viva de las cuatro etapas; "De qué hablamos" (pilares y charlas) en
  campo albedo; "El Laboratorio" como registro de repos; "Lo que construye la
  comunidad" a todo el ancho en rubedo; el manifiesto citado en "Cero humo";
  cierre "Entrar es gratis"; pie con menú grande. El copy aprobado en los dos
  idiomas está en `copy.md`.
- **Se quitan:** las etiquetas sobre los títulos, las versalitas espaciadas, los
  ✦, la numeración 01/04, el brillo pulsante y las partículas del botón, los
  paneles con desenfoque, las esquinas de marco, los degradés decorativos, la
  pintura de fondo de toda la página, el "ia" en otro color del título, la cita
  de Benjamin Franklin, "Anno MMXXVI" y "Forjada con tinta y paciencia".
- Todo el copy nuevo existe en `messages/es.json` y `messages/en.json`.

Fuera de alcance, para una fase siguiente: rediseñar el layout del Launchpad,
de `/brand`, de las imágenes OG y de los mails.

## Segunda vuelta (2026-10-27)

La primera pasada cumple las reglas de ornamento pero se lee flaca: una sola
ilustración recortada cuatro veces, texto largo en una sola voz tipográfica,
secciones que flotan, sin iconografía, y una cámara que termina en más de una
pantalla de marrón oscuro. La segunda vuelta suma sustancia sin volver a los
adornos que se quitaron:

- **La puerta se ilumina.** La cámara del hero acerca hasta 1,5×, pasa a una
  lámina nueva del interior del arco (*umbral*), la luz del atanor crece y la
  pantalla pasa de nigredo a albedo. La sección siguiente arranca en campo
  claro.
- **Políptico de las cuatro etapas** en lugar de la pieza viva con botones:
  cuatro tablas visibles a la vez, cada una con su lámina, su color, su glifo,
  una frase y un link. Explica la paleta sin decirlo.
- **Glifos alquímicos como iconografía**, dibujados en SVG: ♄ ☽ ☉ y la piedra
  para las etapas, ☿ △ 🜔 para los pilares.
- **IM Fell English para los títulos** y Literata para el resto.
- **Portada en cinco partes:** hero, políptico, "De qué hablamos" (con temas
  reales del Discord), "Lo que construye la comunidad" (Launchpad y
  Laboratorio juntos, con estrellas y último commit de cada repo), "Cero humo"
  y el cierre "Entrar es gratis".
- **Láminas nuevas** (`docs/ilustraciones.md`): umbral, las cuatro etapas,
  obra, capitular y la mesa del cierre. Cada lámina se usa una sola vez. Hasta
  que existan, la portada usa recortes del hero como placeholder.
- **Copy a la mitad**, con la bajada del hero aprobada: "Alquimia es una
  comunidad abierta y gratuita para debatir sobre IA y automatización."
- Discord y WhatsApp con el mismo peso, y una línea de prueba con la cantidad
  real de proyectos y de repos.

## Capabilities

### New Capabilities
- `visual-identity`: la letra, la escala tipográfica, la paleta y las reglas de
  ornamento que comparte todo el sitio.
- `landing-page`: qué muestra la portada, en qué orden, cómo se comporta el
  hero y la pieza viva, y qué invita a hacer.

### Modified Capabilities

Ninguna.

## Impact

- `app/globals.css` y `app/[locale]/layout.tsx`: tokens de color, fuentes y
  animaciones.
- Componentes de la landing: `hero-section`, `community-cta`, `launchpad-section`,
  `repos-section`, `repo-card`, `repos-carousel`, `talks-section`,
  `talks-carousel`, `quote-section`, `landing-footer`, `site-header`,
  `mobile-nav`, `section-heading`, `background-effects`, `icons`.
- Unos 40 archivos que referencian las fuentes viejas por nombre
  (`font-[family-name:var(--font-…)]`), entre ellos pantallas del Launchpad,
  admin, cuenta, legales y marca: pasan a los tokens nuevos.
- `public/images/`: las dos escenas del hero; `alchemist.png` deja de usarse.
- `messages/es.json` y `messages/en.json`: claves nuevas y claves que se borran
  (`Hero.eyebrow`, `Quote`, `Common.year`, `Footer.craft`, etc.).
- `components/brand/*` y `lib/brand`: la página de marca muestra los tokens
  nuevos aunque su layout quede para la fase siguiente.
- Sin cambios de base de datos ni APIs. Literata e IM Fell English llegan por
  `next/font/google`. Se suma `sharp` como devDependency para codificar las
  láminas.
