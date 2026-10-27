# Tasks

## 1. Letra y color

- [x] 1.1 Cargar solo Literata en `app/[locale]/layout.tsx` (pesos 400, 500 y 600, cursiva 400, eje de tamaño óptico) y apuntar `--font-sans`, `--font-serif` y `--font-display` a ella en `app/globals.css`; verificar en la red del navegador que la portada descarga solo Literata.
- [x] 1.2 Cambiar los valores de los tokens de color a nigredo, albedo, citrinitas y rubedo, sumar `rubedo`, `albedo` y `on-light`, y borrar `elixir`, `elixir-2`, `copper`, `gold-2`, `ink-4`, `rule` y `rule-2` de `globals.css`; verificar que `pnpm exec tsc --noEmit` y `pnpm build` pasan.
- [x] 1.3 Definir los cinco pasos de tamaño (`note`, `body`, `lead`, `title`, `display`) como utilidades de Tailwind; verificar con una clase de prueba en la portada que cada paso mide lo que dice `design.md`.
- [x] 1.4 Reemplazar cada `font-[family-name:var(--font-…)]` y cada uso de los tokens borrados en `app/` y `components/` por los tokens vigentes; verificar que `grep -rE "font-(cormorant|eb-garamond|im-fell|jetbrains)|elixir|copper|gold-2|ink-4|rule-2" app components` no devuelve nada.
- [x] 1.5 Quitar de `globals.css` las animaciones y clases que dejan de usarse (`cta-pulse`, partículas, esquinas, `bg-fade-in`); verificar que `pnpm check` pasa.
- [x] 1.6 Actualizar `lib/brand/tokens.ts` y los componentes de `components/brand/` para que `/brand` muestre la paleta y la letra nuevas; verificar en el navegador que la página muestra los cuatro colores y Literata.

## 2. Hero "El gran taller"

- [x] 2.1 Agregar las dos escenas a `public/images/hero/` (`taller.png` y `taller-vertical.png`); verificar que el build las sirve.
- [x] 2.2 Reescribir `HeroSection` con `<picture>` y `getImageProps` (vertical bajo `max-aspect-ratio: 4/5`), el oscurecido neutro, el `h1`, la oración, "Entrar al Discord" y "o al grupo de WhatsApp"; verificar a 1440, 768 y 390 px que el título ocupa dos líneas o menos y que los links llevan a `COMMUNITY_LINKS`.
- [x] 2.3 Rehacer `SiteHeader` y `MobileNav` como barra plana (marca, Launchpad, Charlas, Laboratorio, Manifiesto, idioma, ingresar) sobre el hero, sin desenfoque ni versalitas; verificar el menú del teléfono con teclado y lector de pantalla.
- [x] 2.4 Agregar el acercamiento inicial y la entrada del texto en tres tiempos con CSS, con salida para movimiento reducido; verificar con la emulación de `prefers-reduced-motion` que todo aparece quieto.
- [x] 2.5 Crear `HeroCamera` (cliente) que escala la escena hacia el arco y desvanece el contenido al scrollear, con `requestAnimationFrame` y escala máxima 2,6; verificar que el hero se ve completo con JavaScript desactivado y que no hay tirones en el panel de rendimiento.
- [ ] 2.6 Medir el LCP de la portada con Lighthouse en móvil; verificar que queda bajo 2,5 s.

## 3. Secciones de la portada

- [x] 3.1 Crear `WelcomeSection` ("¿Por dónde arrancás?") con `StagePicker`: cuatro opciones con `aria-pressed`, panel `aria-live` y links reales; verificar con teclado, con lector de pantalla y con JavaScript desactivado.
- [x] 3.2 Crear `PillarsSection` en campo albedo con los tres pilares y las charlas (`TALKS` con `HeroVideoDialog`); verificar contraste AAA del texto sobre albedo y que el video abre.
- [x] 3.3 Crear `LabSection` como lista de repos curados (una fila por repo, nombre y descripción, link a GitHub y a la organización), reusando `fetchOrgRepos`; verificar que lista los repos curados y que funciona si GitHub no responde.
- [x] 3.4 Rehacer `LaunchpadSection` a todo el ancho en rubedo con los más apoyados (logo, descripción corta, puntos), la línea de Alquimistas x3, "Ver el Launchpad" y "Publicar proyecto", y el estado vacío; verificar con la base local con y sin proyectos.
- [x] 3.5 Crear `ManifestoSection` ("Cero humo") como carta con link al manifiesto, y `ClosingSection` ("Entrar es gratis") con los dos canales; verificar que los links abren el manifiesto, el Discord y el WhatsApp.
- [x] 3.6 Rehacer `LandingFooter` con el menú grande, los canales, las redes, Términos y Privacidad; verificar cada link.
- [x] 3.7 Armar `app/[locale]/page.tsx` en el orden de la spec y borrar `BackgroundEffects`, `QuoteSection`, `SectionHeading`, `ReposCarousel`, `TalksCarousel`, `CarouselControls` y las partículas de `CommunityCta` si nada más los usa; verificar con `tsc` que no quedan imports rotos.
- [x] 3.8 Ajustar `ScrollReveal` para que el estado inicial sea visible y escalonar título, texto e imagen entre 60 y 90 ms; verificar con JavaScript desactivado que todas las secciones se ven.

## 4. Copy en dos idiomas

- [x] 4.1 Escribir en `messages/es.json` y `messages/en.json` las claves nuevas del hero, la pieza viva, las secciones y el pie, copiando el texto de `copy.md` sin cambios (cualquier ajuste se confirma con el usuario antes); verificar que `pnpm check` pasa y que cada texto de la portada coincide con `copy.md`.
- [x] 4.2 Borrar las claves que ya no se usan (`Hero.eyebrow`, `Hero.titleAccent`, `Quote`, `Common.year`, `Footer.craft`, eyebrows de secciones); verificar con `tsc` y `pnpm check`.
- [x] 4.3 Revisar `/en` completo; verificar que no aparece texto en español.

## 5. Pantallas internas

- [x] 5.1 Recorrer en el navegador Launchpad, detalle de proyecto, formulario, mis proyectos, cuenta, Alquimista, admin, legales y error; corregir todo texto bajo 14 px, en versalitas o sin contraste, y verificar cada pantalla a 1440 y 390 px.

## 6. Verificación integral

- [x] 6.1 Correr el inspector de `design-taste-frontend` sobre la portada en build de producción (`pnpm build && pnpm start`) a 1440, 768 y 390 px; verificar que no quedan eyebrows, monospace, numeración, líneas finas, sombras, desenfoques ni texto bajo 14 px.
- [x] 6.2 Correr `pnpm check` y `pnpm exec tsc --noEmit`; verificar que pasan sin errores.
- [ ] 6.3 Revisar la preview de Vercel en un teléfono real y en desktop; verificar el hero, la cámara, la pieza viva y los dos idiomas.

## 7. Segunda vuelta

- [x] 7.1 Cargar IM Fell English en `layout.tsx`, exponerla como `font-heading` y pasar los títulos de la portada a `font-heading`; verificar en la red que la portada descarga solo IM Fell English y Literata.
- [x] 7.2 Crear `components/glyphs.tsx` con los siete glifos (trazo 1,5, caja 24, `currentColor`); verificar en el navegador que se ven con el mismo peso y que el lector de pantalla no los lee junto al texto.
- [x] 7.3 Sumar el mapa `PLATES` a `scene-picture.tsx` con cada lámina de `docs/ilustraciones.md` y su placeholder; verificar que la portada carga sin 404 de imágenes.
- [x] 7.4 Rehacer `HeroCamera` en capas (escena a 1,5×, *umbral*, luz, polvo, velo albedo) según `design.md`; verificar con capturas al 0, 25, 50, 75 y 100% del recorrido que no hay pantalla muerta ni pixelado, y con movimiento reducido que el hero queda quieto.
- [x] 7.5 Hero: bajada nueva, Discord y WhatsApp con el mismo peso y línea de prueba con `countApprovedProjects()` y los repos curados; verificar con la base con y sin proyectos.
- [x] 7.6 Crear `Polyptych` (servidor) y reemplazar `StagePicker` en la bienvenida; verificar a 1440, 768 y 390 px y con JavaScript desactivado.
- [x] 7.7 Rehacer `PillarsSection` con glifos, los temas reales y la charla; verificar que el video abre.
- [x] 7.8 Juntar `LaunchpadSection` y `LabSection` en "Lo que construye la comunidad" sobre rubedo, con estrellas y último cambio de cada repo (`pushed_at`); verificar con GitHub caído.
- [x] 7.9 Rehacer `ManifestoSection` con la capital iluminada, alineada a la grilla; verificar a 1440 y 390 px.
- [x] 7.10 Rehacer `ClosingSection` sobre la lámina de la mesa y sacar la frase del pie; verificar los links.
- [x] 7.11 Pasar el copy de `copy.md` a `messages/es.json` y `messages/en.json` y borrar las claves que dejan de usarse; verificar con `pnpm check` y `tsc`.
- [x] 7.12 Borrar `StagePicker`, `LabSection` y los estilos `stage-*` que no se usen; verificar con `tsc` y `pnpm check`.
- [x] 7.13 Reemplazar los placeholders por las láminas generadas a medida que lleguen (umbral, umbral vertical, las cuatro etapas, obra, capitular, cierre-mesa); verificar que ninguna imagen de la portada repite a otra.
- [x] 7.14 Correr el inspector de `design-taste-frontend` y recorrer la portada con `agent-browser` a 1440, 768 y 390 px; verificar 0 FAIL y revisar cada captura. (El único FAIL es el degradado de la luz de la puerta, la excepción que fija `visual-identity`.)

## Workflow follow-up

- Abrir el PR a `main` con el cuerpo escrito con el skill `pr`.
- Verificar el cambio con `openspec-verify-change` y archivarlo con `openspec-archive-change` después del merge.
- Fase siguiente: layout del Launchpad, `/brand`, imágenes OG y mails.
