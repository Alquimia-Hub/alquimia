# Noches de Alquimia

El podcast en video de Alquimia. Dos noches por semana, los cohosts charlan
sobre lo que está pasando en IA, automatización, biotech, diseño, seguridad y
startups. Cada tanto se suma un invitado.

Se publica en YouTube, Spotify, X y en [alquimia.community/podcast](https://alquimia.community/podcast),
con subtítulos en español e inglés.

## Formato

Episodios de 30 minutos, grabados.

| Bloque | Duración | Qué es |
|---|---|---|
| **Cold open** | ~20 s | El mejor momento del episodio |
| **Intro** | ~6 s | Animación y sonido de Alquimia |
| **Lo que importa** | ~12 min | Las 3 noticias de la semana |
| **En pantalla** | ~7 min | Demo en vivo de una herramienta, un repo o un paper |
| **¿Hype o real?** | ~6 min | Un tema, dos posturas |
| **De la comunidad** | ~3 min | Un proyecto del Launchpad o una sugerencia de Discord |
| **Cierre** | ~1 min | Predicción de la semana |

Un episodio por semana puede ser de profundidad o con invitado: un solo tema,
con cold open, intro y cierre. De cada episodio salen 3 Shorts.

## Cómo se hace un episodio

Los cohosts eligen los temas, graban y aprueban. El resto es automático.

1. **Curación.** Durante la semana se juntan candidatos de Hacker News, GitHub,
   arXiv, bioRxiv, newsletters y lo que la comunidad sugiere en Discord. Se
   agrupan, se deduplican y se rankean según lo que está pasando y los
   intereses del programa.
2. **Elección.** Los cohosts eligen los temas de cada bloque en el panel.
3. **Guion.** Se genera un guion por episodio: datos clave, links, preguntas
   disparadoras y posturas para el debate.
4. **Grabación.** En Alquimia Studio, una sala de grabación dentro del sitio.
   Cada participante se graba en su propia pista, y la pantalla compartida va
   en una pista aparte.
5. **Postproducción.** Limpieza de audio, transcripción, edición multicámara,
   gráficos, subtítulos, Shorts, títulos, capítulos y miniatura.
6. **Aprobación.** Los cohosts revisan el corte y los Shorts en el panel y
   aprueban la publicación.
7. **Publicación.** El episodio sale programado en cada plataforma.

## Arquitectura

```
                 ┌──────────────── alquimia.community ────────────────┐
 Fuentes ──────▶ │ Curación ─▶ Panel (temas, guion, aprobación)        │
 Bot Discord ──▶ │ Alquimia Studio          /podcast + feed RSS        │
                 └──────┬──────────────────────────────▲──────────────┘
                        │ pistas grabadas               │ cola de trabajos
                        ▼                               │
                 ┌──────────── Estación de producción ──┴─────────────┐
                 │ sync ─▶ audio ─▶ transcripción ─▶ plan de cortes ─▶ │
                 │ render ─▶ Shorts ─▶ YouTube                         │
                 └────────────────────────────────────────────────────┘
```

- **El sitio** (Next.js, Postgres) es el centro de control: curación, panel,
  sala de grabación, página pública y feed RSS.
- **La estación de producción** es un worker que toma trabajos de una cola en
  la base y hace todo el procesamiento de audio y video.
- **El plan de cortes** es un JSON por episodio y es la fuente de verdad de la
  edición. De ahí se renderiza el video, se muestra el corte en el panel y se
  exporta a DaVinci Resolve (`.otio`) para retoques a mano.

## Stack

| Etapa | Herramienta |
|---|---|
| Curación | Fuentes por API y RSS, deduplicación con pgvector, ranking con Claude |
| Comunidad | Bot de Discord propio (`/sugerir`, votos) |
| Guion, títulos, capítulos, selección de Shorts | Claude |
| Llamada | LiveKit |
| Grabación | Alquimia Studio: grabación local en cada navegador, subida por partes a Cloudflare R2 durante la llamada |
| Sincronización de pistas | Reloj compartido + correlación de audio contra una grabación de referencia |
| Limpieza de audio | DeepFilterNet3 por pista + normalización a −14 LUFS |
| Transcripción | Parakeet TDT 0.6B v3 + corrección con Claude (puntuación y términos técnicos) |
| Subtítulos en inglés | Traducción con Claude |
| Edición del episodio | Plan de cortes propio + ffmpeg |
| Gráficos | Remotion (intro, outro, placas de tema, carteles con nombre) |
| Shorts | Remotion, 9:16, encuadre con MediaPipe y subtítulos animados |
| Música | Stable Audio 3 (fondos) y ACE-Step 1.5 (jingle) |
| Miniaturas | Plantilla propia + FLUX.2 klein |
| Publicación | YouTube Data API, feed RSS propio para Spotify y apps de podcast |

### Decisiones

- **Grabación local en cada navegador**: una mala conexión no afecta la calidad
  de la grabación, solo la de la llamada.
- **ffmpeg para el episodio y Remotion solo para gráficos y Shorts**: Remotion
  es lento con varias fuentes de video largas.
- **Cambio de cámara por volumen de cada pista**: como cada participante tiene
  su pista, se sabe quién habla sin adivinar. Se corta con un tiempo mínimo por
  plano, plano dividido cuando hablan dos y layout de pantalla cuando hay demo.
- **Los Shorts los propone la IA y los eligen los cohosts**: cada propuesta
  trae la frase gancho y por qué funciona.
- **Limpieza de audio moderada**: DeepFilterNet3 con atenuación limitada, para
  que las voces suenen naturales.

## Componentes a construir

- [ ] Modelo de datos: fuentes, candidatos, episodios, guiones, trabajos.
- [ ] Curación: ingesta, deduplicación y ranking.
- [ ] Bot de Discord: sugerencias y votos.
- [ ] Panel `/admin/podcast`: temas, guion, revisión del corte, aprobación.
- [ ] Alquimia Studio: sala, grabación local y subida por partes.
- [ ] Worker de producción: sync, audio, transcripción, plan de cortes, render.
- [ ] Templates de Remotion con la identidad de Alquimia.
- [ ] Shorts.
- [ ] Publicación en YouTube y feed RSS.
- [ ] Página pública `/podcast`.
