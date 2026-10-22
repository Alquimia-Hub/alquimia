# Noches de Alquimia

El podcast en video de Alquimia. Los cohosts charlan sobre lo que está pasando
en IA, automatización, biotech, diseño, seguridad y startups. Cada tanto se
suma un invitado.

Se publica en YouTube, Spotify, X y en [alquimia.community/podcast](https://alquimia.community/podcast),
con subtítulos en español e inglés.

**Un episodio por semana** hasta que el proceso sea estable. Después, dos.

## Principio

El producto es el podcast, no la plataforma. Usamos herramientas que ya existen
y construimos solo lo que nos ahorra tiempo todas las semanas. Todo lo demás se
hace a mano hasta que moleste.

## Formato

Episodios de 30 minutos, grabados. Hay dos formatos:

**Actualidad**

| Bloque | Duración | Qué es |
|---|---|---|
| **Cold open** | ~20 s | El mejor momento del episodio |
| **Intro** | ~6 s | Animación y sonido de Alquimia |
| **Lo que importa** | ~12 min | Las 3 noticias de la semana |
| **En pantalla** | ~7 min | Demo en vivo de una herramienta, un repo o un paper |
| **¿Hype o real?** | ~6 min | Un tema, dos posturas |
| **De la comunidad** | ~3 min | Un proyecto del Launchpad o una sugerencia de Discord |
| **Cierre** | ~1 min | Predicción de la semana |

**Profundidad**: un solo tema o un invitado, con cold open, intro y cierre.

Mientras sea uno por semana, el formato por defecto es actualidad, y
profundidad lo reemplaza cuando hay un tema o un invitado que lo justifique.
Con dos por semana, una noche es para cada formato.

De cada episodio salen 3 Shorts. Se piensan desde el guion: cada bloque deja al
menos una pregunta con una respuesta concreta que se entienda fuera de
contexto.

## Cómo se hace un episodio

Los cohosts eligen los temas, graban y aprueban. El resto lo hacen scripts.

1. **Curación.** Un cron junta candidatos de Hacker News, GitHub, arXiv y
   bioRxiv, los deduplica por URL, los rankea y publica el top 10 en un canal
   de Discord. Las sugerencias de la comunidad llegan por otro canal.
2. **Elección.** Los cohosts eligen los temas con reacciones en Discord.
3. **Briefing.** Se genera un briefing por episodio con datos clave y su
   fuente, links, preguntas disparadoras y posturas para el debate. No es un
   guion para leer.
4. **Grabación.** En VDO.Ninja. Cada participante se graba localmente en su
   propia pista, y la pantalla compartida va en una pista aparte. Durante la
   charla se marcan los momentos buenos.
5. **Postproducción.** Sync de pistas, audio, transcripción, plan de cortes,
   render, subtítulos, Shorts, títulos, capítulos y miniatura.
6. **Revisión.** El corte y los Shorts se suben a YouTube como no listados.
   Los cohosts los miran ahí y aprueban o piden cambios en Discord.
7. **Publicación.** Se pasan a públicos en YouTube, se sube el video a Spotify
   for Creators y se postea en X.

## Arquitectura

```
 Fuentes ──▶ cron (GitHub Actions) ──▶ Discord: top 10 ──▶ cohosts eligen
                                                              │
                                                              ▼
                                          briefing ──▶ grabación (VDO.Ninja)
                                                              │ pistas
                                                              ▼
 ┌──────────────────────── Estación de producción ────────────────────────┐
 │ sync ─▶ audio ─▶ transcripción ─▶ plan de cortes ─▶ render ─▶ Shorts   │
 └────────────────────────────────────┬───────────────────────────────────┘
                                      ▼
                YouTube (no listado ─▶ público) · Spotify for Creators · X
                                      │
                                      ▼
                          alquimia.community/podcast
```

- **No hay panel ni cola de trabajos.** Discord es el espacio editorial y
  YouTube no listado es la sala de revisión.
- **La estación de producción** es una compu con scripts del repo. Cada etapa
  es un comando (`pnpm podcast <episodio> <etapa>`) que lee y escribe archivos
  en la carpeta del episodio, así se puede rehacer una etapa sin repetir las
  anteriores. Corre en una Mac con Apple Silicon, pero todo el stack funciona
  también en Linux y Windows.
- **El plan de cortes** es un JSON por episodio y es la fuente de verdad de la
  edición. De ahí se renderiza el episodio y se sacan los Shorts. Si algún día
  hace falta retocar a mano, se exporta a `.otio` para DaVinci Resolve.
- **Spotify for Creators es el host del podcast.** Recibe el video y genera el
  RSS para Apple Podcasts y las demás apps. No mantenemos un feed propio.
- **La página `/podcast`** lee el feed de la playlist de YouTube y muestra los
  episodios embebidos.

## Stack

| Etapa | Herramienta |
|---|---|
| Curación | GitHub Actions (cron), APIs y RSS, deduplicación por URL, ranking con Claude Haiku |
| Comunidad | Webhook de Discord y un canal de sugerencias |
| Briefing, títulos, capítulos, selección de Shorts | Claude |
| Grabación | VDO.Ninja con grabación local por participante |
| Sincronización de pistas | Correlación de audio contra una pista de referencia |
| Audio | ffmpeg (`loudnorm` en dos pasadas); DeepFilterNet3 solo si hay ruido |
| Transcripción | whisper.cpp + corrección con Claude (puntuación y términos técnicos) |
| Subtítulos en inglés | Traducción con Claude |
| Edición del episodio | Plan de cortes propio + ffmpeg |
| Gráficos y Shorts | HyperFrames (intro, placas, carteles con nombre, subtítulos animados) |
| Encuadre de Shorts | Recorte 9:16 centrado sobre la pista de cada cámara |
| Música | Identidad sonora fija: jingle, intro, transición y cierre |
| Miniaturas | Plantilla fija en HyperFrames |
| Publicación | YouTube, Spotify for Creators y X, a mano al principio |

### Decisiones

- **VDO.Ninja en lugar de una sala propia.** Es gratis y graba una pista por
  participante. Si algún día queremos la sala dentro del sitio, se arma con
  LiveKit.
- **Grabación local en cada participante.** Una mala conexión afecta la
  llamada, no la grabación. Hay que confirmarlo en el episodio 0.
- **Scripts locales en lugar de un worker.** No hay infraestructura que
  mantener y se itera rápido. Los originales quedan en disco, y los masters en
  YouTube y Spotify.
- **ffmpeg para el episodio y HyperFrames solo para gráficos y Shorts.**
  Renderizar 30 minutos de varias cámaras en HTML es lento e innecesario.
- **Cambio de cámara por volumen de cada pista.** Como cada participante tiene
  su pista, se sabe quién habla sin adivinar. Se corta con histéresis y un
  tiempo mínimo por plano, con plano dividido cuando hablan dos y layout de
  pantalla cuando hay demo.
- **Los Shorts los propone la IA y los eligen los cohosts.** Las propuestas
  salen de la transcripción y de los marcadores de la grabación, y cada una
  trae la frase gancho y por qué funciona.
- **Un solo proveedor de IA.** Con este volumen, Claude cuesta centavos por
  mes y sumar otro proveedor complica más de lo que ahorra.
- **A mano hasta que moleste.** La publicación, el bot de Discord, el panel y
  MediaPipe se automatizan o se suman cuando el proceso manual sea un problema
  real.

## Episodio 0

Antes de construir cualquier otra cosa: grabar un episodio de prueba de
30 minutos y llevarlo hasta un corte publicable con scripts mínimos.

- [ ] Grabar 30 min con dos participantes en VDO.Ninja, con una demo en pantalla.
- [ ] Confirmar que las pistas se graban en cada dispositivo, no del stream de la llamada.
- [ ] Sincronizar las pistas y masterizar el audio con ffmpeg.
- [ ] Transcribir con whisper.cpp y comparar con `parakeet-mlx` (calidad y tiempo).
- [ ] Generar el plan de cortes por volumen y renderizar el episodio.
- [ ] Subtítulos en español e inglés.
- [ ] Intro, placas y miniatura en HyperFrames.
- [ ] 3 Shorts.
- [ ] Revisar como no listado en YouTube.

Si sale un episodio publicable con una sola ronda de revisión, el pipeline está
listo para usar todas las semanas.

## Después del episodio 0

- [ ] Cron de curación con publicación en Discord.
- [ ] Generación del briefing.
- [ ] Identidad sonora.
- [ ] Página pública `/podcast`.
