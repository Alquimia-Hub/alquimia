# Spec Delta

## Purpose

Fija la letra, la escala tipográfica, la paleta y las reglas de ornamento que
comparten todas las pantallas de Alquimia, para que el sitio se lea de corrido
y se reconozca como una sola marca.

## ADDED Requirements

### Requirement: Dos familias tipográficas con trabajos fijos
Los títulos de sección, el `h1` del hero y la capital iluminada SHALL
componerse en IM Fell English. Todo el resto del texto visible (cuerpo, menú,
botones, etiquetas, puntos y fechas) SHALL componerse en Literata, salvo el
código real dentro de bloques de código. Ninguna pantalla SHALL cargar ni usar
Cormorant Garamond, EB Garamond, IM Fell English SC ni JetBrains Mono. Queda
fuera, para la fase siguiente, la escala de las pantallas internas, que
todavía usan tamaños y espaciado propios.

#### Scenario: Fuentes cargadas en la portada
- **WHEN** se abre la portada en un navegador
- **THEN** las únicas familias descargadas son IM Fell English y Literata

#### Scenario: Título y cuerpo
- **WHEN** se mira una sección de la portada
- **THEN** su título está en IM Fell English y su texto y sus botones en Literata

#### Scenario: Pantalla interna
- **WHEN** un miembro abre el Launchpad, su cuenta o el panel de admin
- **THEN** el texto, los puntos y las fechas se ven en Literata

### Requirement: Escala de cinco tamaños
Las pantallas SHALL usar solo cinco pasos de tamaño: nota (14 px), texto (18 a
21 px), bajada (20 a 26 px), título (32 a 52 px) y display (44 a 96 px). El
texto corrido SHALL tener interlineado de 1,5 a 1,6 y como máximo unos 65
caracteres por línea.

#### Scenario: Texto corrido en desktop
- **WHEN** se mide un párrafo de la portada a 1440 px de ancho
- **THEN** mide 18 px o más, con interlineado entre 1,5 y 1,6

#### Scenario: Pocos tamaños
- **WHEN** se relevan los tamaños de letra en uso en la portada a 1440 px
- **THEN** hay cinco o menos

### Requirement: Nada que se lea por debajo de 14 px
Ningún texto pensado para leerse SHALL medir menos de 14 px en ningún ancho de
pantalla, incluidas etiquetas, fechas, temas de repos, puntos y el pie.

#### Scenario: Teléfono
- **WHEN** se abre la portada a 390 px de ancho
- **THEN** ningún bloque de texto mide menos de 14 px

### Requirement: Sin versalitas espaciadas ni mayúsculas decorativas
Menú, botones, etiquetas y títulos SHALL escribirse en minúscula normal, sin
espaciado de letras agregado. Las mayúsculas solo aparecen donde la ortografía
las pide.

#### Scenario: Botón principal
- **WHEN** se ve el botón "Entrar al Discord"
- **THEN** el texto está en minúscula normal y sin espaciado extra entre letras

### Requirement: Paleta de las cuatro etapas
El sitio SHALL usar cuatro colores con un trabajo fijo cada uno: nigredo
`#14110D` como fondo, albedo `#EDE6D6` como texto y campo claro, citrinitas
`#E0AE45` para la acción principal y su estado activo, y rubedo `#7E2618` como
campo del Launchpad. Ningún color de la interfaz SHALL ser azul.

#### Scenario: Acción principal
- **WHEN** se ve el botón principal de cualquier pantalla
- **THEN** tiene fondo citrinitas plano y texto oscuro

#### Scenario: Sin azul
- **WHEN** se revisan los tokens de color del sitio
- **THEN** ninguno tiene matiz azul, violeta ni turquesa

### Requirement: Contraste AAA en el texto
Todo texto sobre su fondo SHALL tener contraste de 7:1 o más, y el texto
secundario no SHALL bajar de 7:1.

#### Scenario: Texto secundario sobre nigredo
- **WHEN** se mide el contraste del texto secundario sobre el fondo nigredo
- **THEN** es de 7:1 o más

### Requirement: Superficies sin ornamento
Las superficies SHALL separarse por espacio o por un escalón de tono. La
interfaz no SHALL usar líneas finas decorativas, cajas con contorno de 1 px,
sombras en elementos en reposo, brillos, desenfoques de fondo, degradados ni
esquinas de marco. Las tablas y los campos de formulario pueden tener líneas.
Hay dos excepciones, las dos dentro de una escena ilustrada: el oscurecido
neutro detrás del texto y la luz de la puerta en la cámara del hero.

#### Scenario: Botón en reposo
- **WHEN** se ve un botón sin pasar el mouse
- **THEN** no tiene sombra, brillo ni pulso animado

#### Scenario: Degradados permitidos
- **WHEN** se buscan degradados en la portada
- **THEN** solo aparecen el oscurecido detrás del texto del hero y la luz de la puerta

### Requirement: Sin etiquetas, numeración ni símbolos decorativos
Ningún título SHALL llevar una etiqueta chica encima. La interfaz no SHALL
mostrar numeración decorativa (01, 02, "04"), emojis ni glifos de adorno como
✦. Una palabra dentro de un título no SHALL ir en otro color, cursiva o
familia.

#### Scenario: Título de sección
- **WHEN** se ve el título de cualquier sección de la portada
- **THEN** no tiene texto chico encima y está en un solo color y estilo

#### Scenario: Nombre de la marca
- **WHEN** aparece "Alquimia" en un título
- **THEN** se escribe entero en el mismo color, sin destacar "ia"

### Requirement: Glifos alquímicos como iconografía
Los íconos de la marca SHALL ser glifos alquímicos dibujados en SVG con un
mismo grosor de trazo y en `currentColor`, y cada glifo SHALL nombrar algo: las
cuatro etapas (♄ nigredo, ☽ albedo, ☉ citrinitas, la piedra filosofal para
rubedo) y los tres pilares (☿ inteligencia, △ automatización, 🜔
productividad). Un glifo junto a su texto SHALL ser decorativo para lectores de
pantalla (`aria-hidden`); un glifo solo SHALL tener nombre accesible. Los
íconos de interfaz (flechas, Discord, GitHub) siguen como están.

#### Scenario: Pilar
- **WHEN** se ve un pilar en "De qué hablamos"
- **THEN** lleva su glifo en citrinitas sobre su título, y el lector de pantalla lee solo el título

#### Scenario: Coherencia
- **WHEN** se ven juntos los siete glifos
- **THEN** tienen el mismo grosor de trazo y la misma caja

### Requirement: Láminas de una misma serie
Las ilustraciones de la portada SHALL pertenecer a la serie de
`docs/ilustraciones.md`: grabado en cobre en claroscuro, tritono de siena,
sombra y oro, sin azul, sin letras y sin marcos (salvo el de la capitular).
Las láminas SHALL ir con esquinas rectas, salvo las del políptico, que se
recortan en arco.

#### Scenario: Lámina nueva
- **WHEN** se suma una lámina a la portada
- **THEN** está en `docs/ilustraciones.md` con su prompt y su lugar
