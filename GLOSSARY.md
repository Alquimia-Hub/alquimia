# Glosario

Términos del dominio y cómo se usan. La columna **Código** tiene el
identificador en el código. **Evitar** lista sinónimos que generan confusión.

## Comunidad

| Término | Código | Qué es |
|---|---|---|
| **Alquimia** | | Comunidad abierta y gratuita sobre IA, automatización y productividad. |
| **Pilar** | `PILLAR_IDS` | Los tres ejes de la comunidad: inteligencia, automatización y productividad. No es una categoría del Launchpad. |
| **Miembro** | `user` | Cualquiera que participa en la comunidad. |
| **Alquimista** | `isAlquimista` | Miembro verificado del Discord de Alquimia. Sus apoyos valen x3. En inglés: *Alchemist*. |
| **Custodio** | | Persona que lleva la comunidad día a día, según el manifiesto. No es lo mismo que admin. |
| **Fundador** | | Inició Alquimia, maneja los fondos y elige a los custodios. También es custodio. |
| **Firmante** | | Custodio o fundador que firmó `MANIFIESTO.md`. |
| **Charla** | `TALKS` | Charla grabada de la comunidad, publicada en YouTube. |
| **Laboratorio** | `repos` | Repos curados de la organización `Alquimia-Hub`, en la portada y en el menú. Antes se llamaba "Código". |
| **Etapas de la Gran Obra** | `stage` | Nigredo, albedo, citrinitas y rubedo. Dan los cuatro colores de la marca y las cuatro tablas del políptico de la portada ("Recién llego" a "Ya lancé algo"). En la copy no se dice "etapa": esa palabra es del podcast. |
| **Lámina** | `PLATES` | Cada ilustración de la portada, generada con los prompts de `docs/ilustraciones.md`. |

## Launchpad

| Término | Código | Qué es |
|---|---|---|
| **Launchpad** | `launchpad` | Directorio de proyectos de la comunidad, ordenado por apoyos. |
| **Proyecto** | `project` | Lo que se publica en el Launchpad: nombre, descripción corta, logo, web, links y de 1 a 3 categorías. Cada usuario puede tener hasta 5. |
| **Descripción corta** | `tagline` | El pitch de una línea. En la UI nunca se dice "tagline". |
| **Autor** | `ownerId` | Quien publicó el proyecto. Evitar: dueño, owner. |
| **Categoría** | `category` | Una de las 10 categorías fijas del Launchpad. No es un pilar. |
| **Apoyo** / **apoyar** | `vote` | Un usuario apoya un proyecto una sola vez, y puede retirar el apoyo. Evitar en la copy: voto. En inglés: *support*. |
| **Superapoyo** | `VOTE_WEIGHT_ALQUIMISTA` | El apoyo de un Alquimista, que vale 3 en lugar de 1. |
| **Puntos** | `voteScore` | La suma del peso de los apoyos activos. Define el ranking. |
| **Historial de apoyos** | `vote_event` | Registro de cada apoyo dado o retirado, con el peso que tenía en ese momento. |

### Estado de un proyecto

Un mismo estado se nombra distinto según quién lo mire.

| `projectStatus` | El autor ve | El admin ve |
|---|---|---|
| `pending` | En revisión | Pendientes |
| `approved` | Publicado | Publicados |
| `rejected` | Necesita cambios | Rechazados |

- **Enviar** un proyecto lo deja en `pending`. Solo queda **publicado** cuando un
  admin lo aprueba.
- **Volver a revisión:** si se editan los datos visibles de un proyecto
  publicado, vuelve a `pending` y mantiene sus apoyos.
- **Motivo** (`rejectionReason`): por qué se rechazó. Se le manda al autor por mail.

## Moderación

| Término | Código | Qué es |
|---|---|---|
| **Admin** | `role = "admin"` | Rol técnico que se asigna a los mails de `ADMIN_EMAILS`. No es lo mismo que custodio. |
| **Panel** | `/admin/launchpad` | Donde los admins aprueban, rechazan y ven reportes y apoyos. |
| **Reporte** | `report` | Un usuario marca un proyecto publicado. El admin lo **descarta** (`dismissed`) o lo **manda a revisión** (`actioned`). |

## Cuentas

| Término | Código | Qué es |
|---|---|---|
| **Badge de Alquimista** | `badge` | La marca de Alquimista junto al nombre. Evitar: insignia, sello. |
| **Verificar** | `revalidateAlquimistaBadge` | Confirmar con Discord que el usuario está en el server. Vence a los 7 días (`ALQUIMISTA_CHECK_TTL_MS`), y mientras está vencida el apoyo vale 1. |
| **Mi cuenta** | `/account` | Badge, vinculación con Discord, privacidad del avatar y cierre de sesión. |

## Podcast

| Término | Qué es |
|---|---|
| **Noches de Alquimia** | El podcast en video de Alquimia. |
| **Cohost** | Conductor fijo. Elige los temas, graba y aprueba. |
| **Invitado** | Participante ocasional de un episodio. |
| **Formato** | *Actualidad*, con bloques fijos, o *profundidad*, con un solo tema o un invitado. |
| **Bloque** | Cada sección de un episodio de actualidad: cold open, intro, Lo que importa, En pantalla, ¿Hype o real?, De la comunidad y cierre. |
| **Short** | Clip vertical que sale del episodio. Hay 3 por episodio. |
| **Curación** | Juntar, deduplicar y rankear candidatos de las fuentes. Se dispara a mano desde `/admin/podcast`. |
| **Corrida** | Una ejecución de la curación, con su ventana y sus candidatos. En el código: `podcastCurationRun`. |
| **Fuente** | De dónde salen los candidatos: Hacker News, stars de GitHub, arXiv, bioRxiv o newsletters. Se configuran en `lib/podcast/curation/config.ts`. |
| **Candidato** | Noticia, repo o paper que puede volverse tema. En el código: `podcastCandidate`. |
| **Top** | Los candidatos elegidos de una corrida, con un tope por fuente. Por defecto, 10. |
| **Sugerencia** | Candidato que propone la comunidad en su canal de Discord. |
| **Elección** | Los cohosts eligen los temas del top. |
| **Briefing** | Datos, fuentes, preguntas y posturas para cada tema. No es un guion. |
| **Pista** | La grabación de un solo participante o de la pantalla compartida. |
| **Pista de referencia** | La mezcla de la llamada. Se usa para sincronizar las demás pistas. |
| **Marcador** | Un momento bueno que se anota durante la grabación. |
| **Estación de producción** | La compu que corre los scripts del pipeline. |
| **Etapa** | Un paso del pipeline. Se corre con `pnpm podcast <episodio> <etapa>`. |
| **Plan de cortes** | El JSON que es la fuente de verdad de la edición. |
| **Revisión del episodio** | El episodio se sube como no listado a YouTube para que lo aprueben los cohosts. No es la revisión del Launchpad. |
| **Episodio 0** | Episodio de prueba para validar el pipeline. |

## Flujo de trabajo

| Término | Qué es |
|---|---|
| **Cambio** | Una unidad de trabajo de OpenSpec en `openspec/changes/<nombre>/`. |
| **Propuesta** | El `proposal.md` de un cambio: qué se hace y por qué. |
| **Spec** | Los requisitos de una capacidad, en `openspec/specs/`. Un cambio trae los deltas. |
| **Archivar** | Cerrar un cambio implementado y pasar sus deltas a las specs. |
