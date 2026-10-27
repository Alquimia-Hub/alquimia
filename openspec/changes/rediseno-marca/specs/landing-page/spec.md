# Spec Delta

## Purpose

Define qué muestra la portada de Alquimia, en qué orden y cómo se comporta,
para que un visitante entienda qué es la comunidad y se sume por Discord o por
WhatsApp.

## ADDED Requirements

### Requirement: Hero con la escena del gran taller
La portada SHALL abrir con una escena ilustrada a pantalla completa y el
contenido centrado sobre el arco del centro: el título "Entrá al taller de la
IA" en el único `h1`, la oración "Comunidad abierta y gratuita para debatir
sobre IA y automatización.", los botones "Entrar al Discord" y "Entrar al
WhatsApp" con el mismo tamaño, y la línea "Unite a {n} alquimistas", con el
número tomado de `COMMUNITY_MEMBERS` en `lib/constants.ts`.

#### Scenario: Primer pantallazo en desktop
- **WHEN** se abre la portada a 1440 × 900
- **THEN** se ven la escena entera, el título, la oración, los dos botones y "Unite a 200 alquimistas" sin scrollear

#### Scenario: Los dos canales pesan lo mismo
- **WHEN** se miden los dos botones del hero
- **THEN** tienen la misma altura y el mismo tamaño de letra, y llevan a los canales reales de la comunidad

#### Scenario: Cantidad de miembros
- **WHEN** se cambia `COMMUNITY_MEMBERS`
- **THEN** el hero muestra el número nuevo

### Requirement: La escena se adapta al formato de pantalla
En pantallas verticales la portada SHALL mostrar la versión vertical de la
escena, con las situaciones de los costados todavía visibles. En pantallas
horizontales SHALL mostrar la versión horizontal.

#### Scenario: Teléfono
- **WHEN** se abre la portada a 390 × 844
- **THEN** se ve la versión vertical, con la cúpula arriba, el texto en el arco y las estatuas abajo

### Requirement: El título del hero entra en dos líneas
El título del hero SHALL ocupar dos líneas o menos en cualquier ancho, y su
texto SHALL leerse sobre la escena con contraste suficiente gracias a un
oscurecido neutro detrás.

#### Scenario: Anchos de referencia
- **WHEN** se mide el título a 1440, 768 y 390 px
- **THEN** ocupa dos líneas o menos en cada uno

### Requirement: La cámara cruza la puerta hacia la luz
Al cargar, la escena SHALL acercarse levemente hasta su lugar y el contenido
SHALL aparecer escalonado (título, oración, botones y prueba). Al scrollear el hero, la escena SHALL acercarse
al arco mientras el contenido se desvanece, sin pasar de 1,5× mientras se ve
entera; después
SHALL pasar a la lámina del interior del arco (*umbral*), la luz del fondo
SHALL crecer hasta llenar la pantalla y la pantalla SHALL terminar en albedo,
el mismo campo con el que empieza la sección siguiente. En ningún momento la
pantalla SHALL quedar más de media pantalla de scroll sin contenido ni luz
visible. Con movimiento reducido, todo aparece quieto.

#### Scenario: Scroll en el hero
- **WHEN** el visitante baja por el hero
- **THEN** la escena se acerca al arco, el texto se desvanece, la luz crece desde la puerta y la pantalla termina en campo claro sin corte con la sección siguiente

#### Scenario: Sin pixelado
- **WHEN** se mira la escena mientras se ve entera, antes de cruzar el arco, a 1440 px
- **THEN** no está ampliada más de 1,5× sobre su resolución servida; al cruzar, el taller se agranda junto con el arco mientras se apaga

#### Scenario: Movimiento reducido
- **WHEN** el sistema pide reducir el movimiento
- **THEN** la escena y el texto aparecen quietos y legibles, sin acercamiento ni luz animada

#### Scenario: Sin JavaScript
- **WHEN** el script no corre
- **THEN** el hero se ve completo y legible, y la sección siguiente empieza enseguida

### Requirement: Secciones de la portada en orden
Después del hero, la portada SHALL mostrar, en este orden y cada una con su
propio título: "¿Por dónde arrancás?" (el políptico), "De qué hablamos", "Lo
que construye la comunidad", "Cero humo", "Entrar es gratis" y el pie. Ninguna
sección vecina SHALL repetir la misma composición. El texto de cada sección es
el de `copy.md`.

#### Scenario: Recorrido completo
- **WHEN** el visitante scrollea toda la portada
- **THEN** ve las seis partes en ese orden, cada una con su título

### Requirement: Políptico de las cuatro etapas
"¿Por dónde arrancás?" SHALL mostrar a la vez cuatro tablas, una por etapa de
la Gran Obra y en este orden: nigredo "Recién llego", albedo "Quiero aprender",
citrinitas "Estoy armando algo" y rubedo "Ya lancé algo". Cada tabla SHALL
llevar su lámina recortada en arco, el campo de su color, su glifo, el nombre
de la etapa como pie de la lámina, una frase con el paso que sigue y su acción: "Entrar al grupo", que despliega
Discord y WhatsApp; el canal de YouTube; los repos de `Alquimia-Hub`; o el
formulario del Launchpad. No SHALL hacer falta tocar nada para ver las cuatro.

#### Scenario: Desktop
- **WHEN** se abre la sección a 1440 px
- **THEN** las cuatro tablas se ven en una fila, de la más oscura a la roja

#### Scenario: Teléfono
- **WHEN** se abre la sección a 390 px
- **THEN** las cuatro tablas se apilan en el mismo orden, cada una con su link a mano

#### Scenario: Destino
- **WHEN** el visitante toca "Publicar mi proyecto" en la tabla rubedo
- **THEN** llega a `/launchpad/new`

#### Scenario: Entrar al grupo
- **WHEN** el visitante toca "Entrar al grupo" en la tabla nigredo, con o sin JavaScript
- **THEN** se despliegan "Discord" y "WhatsApp", con el mismo tamaño

### Requirement: Pilares con su glifo y temas reales
"De qué hablamos" SHALL listar los tres pilares (inteligencia, automatización
y productividad), cada uno con su glifo y una frase, más una lista de temas
que se debatieron en la comunidad y la charla grabada con su miniatura de
YouTube. Los temas SHALL ser reales; no se inventan.

#### Scenario: Pilares
- **WHEN** el visitante llega a la sección
- **THEN** ve los tres pilares con su glifo, los temas recientes y la charla de mayo 2026

### Requirement: Lo que construye la comunidad
"Lo que construye la comunidad" SHALL ocupar todo el ancho sobre el campo
rubedo y SHALL juntar dos partes: los proyectos publicados más apoyados del
Launchpad, con su logo, descripción corta y puntos, más "Ver todos los
proyectos" y "Publicar proyecto"; y "El Laboratorio", los repos curados de
`Alquimia-Hub` con su descripción, estrellas y fecha del último cambio, más un
link a la organización. El sistema de puntos no SHALL explicarse en la
portada.

#### Scenario: Con proyectos
- **WHEN** hay proyectos publicados
- **THEN** la sección muestra los más apoyados, ordenados por puntos

#### Scenario: Sin proyectos
- **WHEN** no hay ningún proyecto publicado
- **THEN** la parte de proyectos invita a publicar el primero, con un link a `/launchpad/new`, y el Laboratorio se ve igual

#### Scenario: GitHub no responde
- **WHEN** la API de GitHub falla
- **THEN** el Laboratorio lista los repos curados sin estrellas ni fecha

### Requirement: Manifiesto con capital iluminada
"Cero humo" SHALL citar textualmente el compromiso del manifiesto
("Compartimos lo que probamos y contamos también lo que no funcionó."), con la
primera letra como capital iluminada y un link a leerlo completo, sin firma
ni nombres de los fundadores. El bloque SHALL alinearse con la grilla de la página.

#### Scenario: Carta
- **WHEN** el visitante llega a "Cero humo"
- **THEN** lee la cita con su capital y tiene un link al manifiesto completo, sin nombres de los fundadores

#### Scenario: Inglés
- **WHEN** el visitante abre `/en` y toca "Read the manifesto"
- **THEN** abre el manifiesto, que por ahora existe solo en español

### Requirement: Cierre y pie
"Entrar es gratis" SHALL repetir la invitación con los dos canales, con su
propia lámina debajo (la mesa con la silla vacía), distinta de la del hero. El pie SHALL mostrar el menú
(Launchpad, Charlas, Laboratorio, Manifiesto, Marca), los canales y redes, y
los links a Términos y Privacidad.

#### Scenario: Cierre
- **WHEN** el visitante llega al final de la portada
- **THEN** puede entrar al Discord o al WhatsApp sin volver a subir

### Requirement: Cada lámina se usa una vez
Cada ilustración de la portada SHALL aparecer una sola vez: ninguna sección
SHALL mostrar un recorte de la escena del hero ni de otra sección. Mientras
una lámina de `docs/ilustraciones.md` no exista, la sección SHALL usar un
placeholder, y el placeholder SHALL quedar listado en `tasks.md` hasta que se
reemplace.

#### Scenario: Portada terminada
- **WHEN** existen todas las láminas de `docs/ilustraciones.md`
- **THEN** ninguna imagen de la portada repite a otra

### Requirement: Imagen para redes con la marca
La imagen OG (y la de X) SHALL mostrar, sobre la escena del taller oscurecida,
solo el logo y "Alquimia" en grande (IM Fell English) y el título del hero
debajo, en el idioma de la ruta, legibles como miniatura.

#### Scenario: Compartir el link
- **WHEN** se pide `/opengraph-image/og` o `/en/opengraph-image/og`
- **THEN** devuelve un PNG de 1200 × 630 con el logo, "Alquimia" y el título en ese idioma

### Requirement: Portada en los dos idiomas
Todo texto visible de la portada SHALL existir en español y en inglés, y SHALL
mostrarse en el idioma de la ruta (`/` o `/en`).

#### Scenario: Inglés
- **WHEN** se abre `/en`
- **THEN** todos los títulos, botones, el políptico y los temas aparecen en inglés
