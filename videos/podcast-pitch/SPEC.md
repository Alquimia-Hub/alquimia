# SPEC — Noches de Alquimia (El alambique)

GOAL:    los admins entienden en 80 s qué es el podcast y que, salvo elegir, grabar y
         aprobar, todo el proceso es automático y con qué stack.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps
TIME:    82 s x 30 = 2460 frames. Música: noche.wav (piano nocturno, loop 21 s) 0–40 s;
         magia.wav (cuerdas y celesta, 44 s) desde 38 s: pico a 54.2 s (la gota cae en
         las vasijas), sección C a 70.7 s (claim). Sin voz.
LOOK:    fondo #0a0806 sólido + un brillo local radial #b86a2a al 22% detrás del objeto
         héroe, viñeta 12%. Medio: grabado en cobre: líneas #d99a3d de 3 px para los
         objetos, rayado #b86a2a al 35% para sombras, texto #ead9b8, secundario #9d8b6a.
         Display: Cormorant Garamond Regular 84–150 px, tracking -1%. Rótulos: IM Fell
         English SC 28–34 px, tracking 0.28em. El dorado #f0b956 solo en la gota y en la
         palabra clave de cada línea.
OBJECTS: la ilustración del alquimista (asset de la marca); la gota de luz (círculo
         #f0b956 28 px con halo, el único brillo); embudo y matraz de vidrio en línea;
         un pergamino con el guion; la sala de grabación con dos cámaras y una pantalla;
         el alambique con serpentín; un sello de lacre; tres vasijas; un astrolabio de
         30 minutos. Logos reales del stack en medallones grabados (anillo doble, logo
         en tinta, nombre debajo).
MOTION:  llegadas expo.out 0.6–0.9 s; cámara power2.inOut; salidas power3.in 0.35 s;
         líneas que se dibujan (stroke-dashoffset) 0.8–1.4 s power2.inOut; palabras
         blur 6→0 en 0.13 s cada 0.07 s; medallones caen con elastic.out(1,0.75).
SHOTS:
  0.0–7.0   noche: el alquimista, push 1.0→1.12 hacia el frasco; "Dos noches por semana"
            a 0.8 s. Zoom a través del frasco 6.2–7.0 (whoosh).
  7.0–13.5  titulo: "Noches de Alquimia" letra por letra; temas palabra por palabra;
            "30 minutos · YouTube, Spotify y X". La gota nace y cae (whip abajo).
  13.5–21.5 curacion: seis fuentes caen al embudo (pop cada una); el matraz se llena;
            Claude y pgvector grabados en el vidrio. Línea arriba a la izquierda.
  21.5–29.0 guion: pergamino que se desenrolla; tres bloques se tildan (click).
  29.0–37.5 grabacion: Alquimia Studio, dos cámaras y pantalla, una onda por pista;
            LiveKit y Cloudflare R2. Las tres pistas bajan como hilos (match cut).
  37.5–49.0 destilado: los hilos entran al alambique; cuatro etapas a lo largo del
            serpentín con Parakeet (NVIDIA), DeepFilterNet, FFmpeg, Remotion, Claude.
            Cambia la música a 38 s.
  49.0–53.0 aprobacion: el panel y el botón "Aprobar"; click y sello "Aprobado" (stamp).
  53.0–62.0 publicacion: la gota cae y se divide en YouTube, Spotify y X + /podcast
            en 54.2 (impact + sparkle, el momento más grande).
  62.0–71.0 receta: el astrolabio de 30 min se arma bloque por bloque.
  71.0–82.0 cierre: "Los cohosts graban. El resto se transmuta." y la marca de Alquimia
            se dibuja (riser al pico 75.5). Hold hasta el final.
BANNED:  vacío oscuro con cosas chicas flotando (cada héroe >= 40% del cuadro);
         partículas, orbes y glows salvo la gota; tres tarjetas en fila; pills; logo en
         una esquina; todo entrando con fade y slide-up; títulos que se mueven después de
         aterrizar; rótulos numerados "01/02"; HUDs y corchetes.
QA:      3.0 (alquimista + título legible), 10.0 (título completo), 18.0 (embudo con
         logos), 26.0 (guion), 34.0 (studio), 44.0 (alambique), 51.5 (sello), 55.0
         (vasijas), 68.0 (astrolabio), 79.0 (marca).
