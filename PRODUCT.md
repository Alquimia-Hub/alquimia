# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Gente curiosa por la inteligencia artificial, la automatización y la
productividad, que habla español (el sitio también está en inglés). No hace
falta ser experto. Vienen de muchos roles; los que pide el onboarding del
Discord son desarrollo, devops, diseño, testing, producto, marketing, finanzas,
legales, ciencias y negocio.

Llegan a la landing por boca en boca o por redes, y deciden si se suman. En el
Launchpad, los miembros publican sus proyectos y apoyan los de otros.

Sin confirmar: países de origen y cantidad de miembros.

## Product Purpose

Alquimia es una comunidad abierta y gratuita para investigar IA y automatización
entre personas. Existe porque un chat de IA no da el cruce con otros: alguien
que ya probó la herramienta, que muestra su workflow o que discute una
conclusión.

El sitio tiene un éxito principal: que el visitante se sume a la comunidad, por
Discord o por WhatsApp, el que prefiera. Los dos canales valen lo mismo.

Superficies: la landing, el Launchpad (directorio de proyectos ordenado por
apoyos), la página de marca, el podcast *Noches de Alquimia* (planeado en
`docs/podcast.md`), los mails transaccionales y las imágenes para redes (OG).

## Positioning

Es abierta y gratuita, la decide la comunidad y no hace falta saber para
entrar. El nombre lleva la idea adentro: Alquim**IA**, transformar lo que uno
sabe en algo más valioso, con otros.

## Operating Context

- Discord (canal principal, con onboarding por roles) y un grupo de WhatsApp.
- Launchpad: login con Google o Discord, proyectos revisados por un admin,
  apoyos de 1 punto y superapoyos de 3 para los Alquimistas verificados en el
  Discord.
- Charlas grabadas en YouTube y repos open source en la organización
  `Alquimia-Hub`.
- Podcast semanal en video *Noches de Alquimia* (YouTube, Spotify, X).

## Capabilities and Constraints

- Next.js App Router, Tailwind y shadcn/ui, next-intl (español por defecto,
  inglés en `/en`). Todo corre en planes gratuitos.
- Todo texto visible existe en `messages/es.json` y `messages/en.json`.
- El vocabulario está fijado en `GLOSSARY.md` (Alquimista, custodio, apoyo,
  superapoyo, pilar, categoría) y no cambia con el rediseño.
- Los tres pilares son inteligencia, automatización y productividad.

## Brand Commitments

- El nombre Alquimia y la metáfora alquímica quedan. La comunidad tiene que
  conservar su mística: lo esotérico y alquímico sigue, pero bien hecho. No se
  lleva a un laboratorio moderno ni a una abstracción.
- El estilo es renacentista y parte de la ilustración actual
  (`public/images/alchemist.png`): un alquimista en su laboratorio, luz de
  vela y oro. El rediseño evoluciona ese estilo, no lo reemplaza. Las
  ilustraciones son pintadas y las genera el equipo con GPT.
- Referencias elegidas: pintura de laboratorio en claroscuro (Wright of Derby,
  Teniers, Toorenvliet), el *Splendor Solis* y los emblemas grabados
  (*Atalanta Fugiens*, *Rosarium Philosophorum*).
- Nada de azul con oro: son los colores de Boca. Pocos colores, salvo que una
  combinación más rica quede claramente mejor.
- El tono genera intriga y ganas de pertenecer, sin abrumar ni asustar.
- El logo actual puede rehacerse. Todo lo visual está abierto a rediseño.
- Voz del manifiesto: cero humo, abierta, cercana, sin preguntas tontas.
- Anti-referencias: la landing SaaS genérica y la estética de "AI slop".

## Evidence on Hand

- Proyectos reales en el Launchpad (9 publicados al 2026-10-26) con sus logos.
- Una charla grabada: *AI Agents on opBNB for Fintechs* (mayo 2026).
- Repos open source de `Alquimia-Hub` (alquimia, alquimia-cli, ai-payments, …).
- `MANIFIESTO.md` firmado por los fundadores.
- No hay fotos de encuentros, de miembros ni capturas de la comunidad. La
  imagen visual se resuelve con ilustración, por decisión del equipo.
- No inventar cantidad de miembros, testimonios, logos de empresas ni métricas.

## Product Principles

1. **Sumarse es lo primero.** Cada superficie acerca al Discord o al WhatsApp.
2. **Para curiosos, no para expertos.** Nada asume conocimiento técnico.
3. **La comunidad decide.** Lo que construyen y apoyan los miembros es la
   prueba más fuerte, por encima de cualquier claim.
4. **Mística con sustancia.** Lo alquímico es la voz, nunca el reemplazo del
   contenido.
5. **Cero humo.** Solo se muestra lo que existe.
