# Ilustraciones de la portada

Prompts para generar con GPT las láminas de la landing. Todas siguen el estilo
de la escena del hero (`assets/plates/taller.png`): grabado en cobre en
claroscuro, tritono de siena, sombra y oro, y verde verdín solo en las estatuas.

## Cómo generarlas

1. Abrí un chat nuevo de GPT por lámina y adjuntá `assets/plates/taller.png`
   como referencia de estilo.
2. Pegá el prompt de la lámina y, debajo, el [bloque común](#bloque-común).
3. Pedí el tamaño que dice cada lámina (son los tres que GPT genera: 1536 × 1024,
   1024 × 1536 y 1024 × 1024) en calidad alta.
4. Generá dos o tres variantes y quedate con la que respete mejor la
   composición: dónde va el texto, dónde va la luz, qué zona queda tranquila.
5. Guardá el PNG en `assets/plates/` con el nombre de la lámina y corré
   `node scripts/encode-plates.mjs <nombre>`, que genera en
   `public/images/hero/` el AVIF y el WebP que sirve el sitio. Los PNG no se
   publican.

Cada lámina se usa una sola vez en la portada. Si una variante sale con letras,
símbolos, azul o un marco, se descarta: no se arregla con retoque.

## Bloque común

Va al final de cada prompt, salvo donde la lámina diga otra cosa.

```text
Style: match the attached reference image exactly. A surreal chiaroscuro copperplate engraving with relief texture: every surface built from fine parallel engraved lines, cross-hatching and stipple, coloured as a tritone. Burnt sienna and raw umber in the shadows, warm ochre and pale gold in the lights, near-black brown in the deepest areas. Renaissance figures in period clothing, calm and graceful gestures. Serene, curious and welcoming. One clear focal group and generous quiet space.

Avoid: any blue, navy, teal or purple; night sky, moon or stars; text, letters, numbers, runes or symbols anywhere; logos, frames, borders, watermarks; screens, robots or modern objects; magic particles, lens flares, neon, fantasy game art; demons or monsters; crowds or clutter.
```

## Láminas

| Archivo | Tamaño | Dónde va |
|---|---|---|
| `taller.png` | 1536 × 1024 | La escena del hero, y la referencia de estilo de todas las demás |
| `taller-vertical.png` | 1024 × 1536 | La escena del hero en teléfonos |
| `umbral.png` | 1536 × 1024 | El interior del arco, al final de la cámara del hero |
| `umbral-vertical.png` | 1024 × 1536 | Lo mismo, en teléfonos |
| `stage-nigredo.png` | 1024 × 1536 | Políptico: "Recién llego" |
| `stage-albedo.png` | 1024 × 1536 | Políptico: "Quiero aprender" |
| `stage-citrinitas.png` | 1024 × 1536 | Políptico: "Estoy armando algo" |
| `stage-rubedo.png` | 1024 × 1536 | Políptico: "Ya lancé algo" |
| `obra.png` | 1536 × 1024 | "Lo que construye la comunidad", sobre rubedo |
| `capitular.png` | 1024 × 1024 (la generada salió de 1254 × 1254) | Marco de la capital de "Cero humo" |
| `cierre-mesa.png` | 1536 × 1024 | "Entrar es gratis" |

### Taller: la escena principal

La escena del hero y la referencia de estilo de toda la serie. Es el prompt
original, tal como se usó; no lleva el bloque común porque el estilo está
escrito adentro.

```text
A wide, symmetrical panoramic scene of a vast Renaissance alchemical workshop hall, seen straight on at eye level. Rendered as a surreal chiaroscuro copperplate engraving with relief texture: every surface built from fine parallel engraved lines and stipple, coloured as a tritone.

Composition, strictly:
- Centre, the middle 40% of the width from top to bottom: a monumental stone archway opening onto deep, calm, warm darkness, with a faint amber glow far inside, like a furnace at the end of a corridor. Very low detail, no people, no objects. This area must stay quiet because text will be placed over it.
- Left third, learning: a scholar at a desk while a quill writes glowing lines on the parchment by itself; three people of different ages gathered around a bronze talking head on a stone pedestal, the medieval "brazen head", one of them asking it a question with an open hand; an old master guiding a young apprentice's hand on a brass astrolabe. Tall bookshelves behind them.
- Right third, making: two craftsmen releasing a small brass mechanical bird that takes flight from their hands; a wooden gear-and-pulley mechanism turning the pages of a large book on its own; a woman raising a glass flask that glows deep red while two others look up at it.
- Bottom left and bottom right corners only: large figures in sculptural flowing drapery, cropped by the frame edges, turning and reaching toward the central archway as if inviting the viewer in.
- Above: a coffered dome with an open oculus pouring warm golden light down onto the archway, lighting both sides evenly.
- A wide flight of shallow stone steps leads from the foreground up to the archway.

Harmony: balanced masses on the left and right, calm and graceful gestures, every group clearly separated by architecture and space, the eye guided from the corners toward the centre. Serene, curious and welcoming, never chaotic.

Colour: tritone. Burnt sienna and raw umber in the shadows, warm ochre and pale gold in the lights, near-black brown in the deepest areas. Deep verdigris green, the colour of oxidised copper leaning toward olive, never teal, used only on the foreground corner figures. Everything else is warm monochrome.

Avoid: any blue, navy, teal or purple; night sky, moon or stars; text, letters, numbers, runes or symbols anywhere; logos, frames, borders, watermarks; screens, robots or modern objects; magic particles, lens flares, neon, fantasy game art; demons or monsters; crowds or clutter.
```

`taller-vertical.png` salió del mismo prompt en formato vertical (1024 × 1536);
su prompt exacto no quedó registrado.

### Umbral

Lo que hay detrás del arco. La cámara del hero entra por la puerta y pasa a
esta lámina, así el acercamiento no se pixela y termina en la luz.

```text
The view through the great stone archway of the reference image, as if the viewer has climbed the steps and now stands just inside the arch. A long, quiet barrel-vaulted corridor of warm stone recedes in strict one-point perspective. At its far end, exactly at the horizontal centre and slightly below the vertical centre of the frame, stands a large brick athanor, an alchemical furnace, whose round open mouth blazes with intense pale-gold, almost white light. That light is the brightest point of the image: it washes the floor, the vault and the pillars in warm gold and fades smoothly to near-black brown at all four edges. No people. Only a few closed books and a glass alembic on low ledges near the furnace, in silhouette. The middle third stays simple and symmetrical because the camera will zoom into it.
```

Para `umbral-vertical.png`, agregá al final del prompt:

```text
Vertical version: a taller vault, the furnace mouth exactly at the centre of the frame.
```

### Las cuatro etapas

Cuatro tablas de un políptico, una por etapa de la Gran Obra. En la página se
recortan con la parte de arriba en arco, por eso el motivo va centrado. Cada
una tiene un peso de color distinto: de la más oscura (nigredo) a la roja
(rubedo).

Empezá los cuatro prompts con este párrafo:

```text
Vertical emblem plate, composed to sit inside a round-topped arched niche: keep the subject within the central 70% of the width, with calm dark space at the top corners and along the sides.
```

**`stage-nigredo.png`**: la llegada.

```text
Scene: a traveller in a hooded wool cloak, seen from three-quarters behind, stands on a stone threshold before a tall wooden door that is opening inward. A thin vertical blade of warm amber light from inside falls across the traveller's face and the hand lifted to push the door. A black raven perches on the stone lintel above, looking down calmly. Mood: arrival and curiosity, never fear. Colour weight: the darkest plate of a series of four. 80% of the surface is near-black brown and raw umber; the only light is the amber blade from the door.
```

**`stage-albedo.png`**: aprender.

```text
Scene: in a tall bright room, a young apprentice sits at a wooden lectern reading a large open book, while an older master stands beside them pointing calmly at a passage. Soft, even morning light enters through a tall arched window on the left. A white dove rests on the window sill. Colour weight: the palest plate of the series. Most of the surface is pale bone, ivory and light warm ochre, with soft umber shadows only in folds and furniture.
```

**`stage-citrinitas.png`**: armar algo.

```text
Scene: a craftsperson in a leather apron works at an orderly workbench, fitting the last brass feather onto a small mechanical bird held in a vice. Around them: gears, fine tools, a candle, and a brass sun-shaped gear wheel hanging on the wall. A young helper holds a magnifying lens over the work. Colour weight: saffron, warm ochre and burnished gold dominate, as if the whole room glows in late-afternoon sun; shadows in burnt sienna.
```

**`stage-rubedo.png`**: lanzar.

```text
Scene: a figure stands on a low stone platform and raises a glass flask that glows deep crimson, lighting their face from below. In front of the platform, four people of different ages lift their open hands toward it in support. A phoenix with spread wings is carved in relief on the stone wall behind. Colour weight: deep crimson, madder red and burnt sienna dominate; the red flask is the brightest point; the rest is warm umber.
```

### Obra

Para "Lo que construye la comunidad", sobre el campo rubedo. Se recorta como
una franja ancha, por eso los objetos van en una sola banda horizontal.

```text
Scene: the long display wall of the workshop where finished works are kept: deep wooden shelves and a long table holding a mechanical bird, an astrolabe, a small walking automaton, a model windmill, bound manuscripts and glowing glass flasks. Each piece has a small blank red wax seal tied to it with a cord. Three visitors walk along the table; one ties a red ribbon to a piece they like. Composition: a wide horizontal frieze. The objects line up along one horizontal band across the middle so the image can be cropped to a 3:1 strip. Colour weight: burnt sienna and madder red, to sit on a deep red background.
```

### Capitular

El marco de la capital iluminada de "Cero humo". La letra la pone el sitio, en
tipografía: el centro tiene que quedar vacío.

En esta lámina, sacá `frames, borders` de la lista *Avoid* del bloque común.

```text
An ornamental square frame for an illuminated initial, in the manner of a Renaissance alchemical manuscript, rendered as a copperplate engraving. A thick square border of interlaced vines, small alembics, a salamander and an oak branch, engraved in burnt sienna and pale gold. The inner square, about 60% of the width and exactly centred, is completely empty: a flat, smooth near-black brown field with no texture, no letter and no ornament, because a letter will be placed there later. Outside the border, the same near-black brown.
```

### Cierre: la mesa

"Hay un lugar en la mesa." Reemplaza al recorte del hero que se usa hoy en el
cierre.

```text
Scene: a long wooden refectory table inside the workshop, lit by candles and the warm glow of a furnace far behind. Eight people of different ages sit along both sides, talking, pointing at a notebook, one sketching a mechanism, one laughing. In the centre foreground, at the near end of the table and facing the viewer, one heavy wooden chair is pulled back and empty, inviting the viewer to sit. The top 35% is calm: a dark vaulted ceiling with very low detail, because a headline will sit there. In the bottom corners, the same large verdigris-green draped figures as in the reference, smaller, reaching toward the empty chair.
```

## Fuera de esta tanda

- La miniatura de la charla es la del video en YouTube y no se reemplaza.
- No hay retratos de los fundadores ni del equipo.
