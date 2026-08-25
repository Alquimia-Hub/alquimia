<div align="center">

# Alquimia

**Comunidad abierta sobre inteligencia artificial, automatización y productividad.**

[alquimia.community](https://alquimia.community) · [Discord](https://discord.gg/wkhHrWZC3Q) · [X](https://x.com/alquimia_hub)

</div>

---

Este repositorio es el sitio de Alquimia: la página pública de la comunidad y el
**Launchpad**, un directorio donde cualquiera puede publicar su startup o proyecto
y la comunidad decide qué merece más visibilidad.

Todo el sitio está en **español e inglés**.

## Qué hay adentro

### La landing

La puerta de entrada: qué es Alquimia, sobre qué compartimos conocimiento, los
proyectos open source de la comunidad, las charlas grabadas y los links para
sumarse al Discord y al grupo de WhatsApp. Arriba de todo aparece el top de
proyectos más apoyados del Launchpad.

### Alquimia Launchpad

Un directorio de proyectos hecho por y para la comunidad.

- **Cualquiera puede publicar.** Entrás con Google o Discord, cargás tu proyecto
  con logo, descripción, categorías y links, y queda en revisión.
- **Un admin lo aprueba.** Antes de publicarse, alguien del equipo lo revisa. Si
  hace falta corregir algo, te llega el motivo por mail y lo podés reenviar.
- **La comunidad apoya.** Cualquier usuario logueado puede apoyar un proyecto una
  vez. El ranking se arma con esos apoyos y se actualiza al instante.
- **Los Alquimistas valen x3.** Si verificás que sos parte de nuestro Discord,
  ganás el badge de *Alquimista* y tus apoyos cuentan el triple. El badge se
  revalida solo: si dejás el server, tus votos vuelven a valer uno.
- **Se busca y se filtra.** Búsqueda por palabra clave y filtros por categoría,
  con las diez categorías que cubren desde negocios hasta diseño.

### Marca

Una página con los elementos visuales de Alquimia: logo para descargar, paleta de
colores y tipografías.

## Cómo está hecho

| | |
|---|---|
| **Framework** | Next.js con App Router y React Server Components |
| **Estilos** | Tailwind CSS y componentes de shadcn/ui |
| **Idiomas** | next-intl — español por defecto, inglés bajo `/en` |
| **Base de datos** | Postgres (Neon) con Drizzle |
| **Cuentas** | Better Auth, con Google y Discord |
| **Imágenes** | Vercel Blob |
| **Mails** | Resend con plantillas en React Email |
| **Hosting** | Vercel |

Todo corre dentro de los planes gratuitos.

## Levantar el proyecto

```bash
pnpm install
pnpm setup:local    # configuración local
pnpm db:up          # base de datos
pnpm db:reset       # tablas y categorías
pnpm dev:services   # servicios simulados
pnpm dev            # la app en http://localhost:3000
```

Para desarrollar no hacen falta credenciales reales: hay emuladores locales de
todos los servicios externos. El paso a paso completo está en
**[docs/desarrollo-local.md](docs/desarrollo-local.md)**.

## Estructura

```
app/          páginas y rutas
components/   componentes de interfaz
lib/          lógica de negocio, base de datos y servicios
messages/     todos los textos, en español e inglés
emails/       plantillas de los mails
docs/         guía para trabajar en local
```

## Cómo colaborar

1. Creá una branch desde `main`.
2. Hacé tus cambios. Antes de commitear, corré `pnpm check` — revisa formato,
   calidad de código y que no falte ninguna traducción.
3. Abrí un Pull Request. Vercel genera una preview automática para revisarlo.
4. Al mergear a `main`, se despliega solo a producción.

Los textos que ve el usuario nunca van escritos dentro de un componente: viven en
`messages/es.json` y `messages/en.json`, y siempre en los dos idiomas.

## Documentación

- **[Trabajar en local](docs/desarrollo-local.md)** — cómo levantar el proyecto en tu máquina, sin necesidad de credenciales.

---

<div align="center">
<sub>Hecho por la comunidad de Alquimia.</sub>
</div>
