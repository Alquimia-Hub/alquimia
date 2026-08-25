# Trabajar en local

Cómo levantar el sitio de Alquimia en tu máquina para desarrollar.

No necesitás credenciales de nada. Google, Discord, los mails y la subida de
imágenes están simulados localmente, así que el proyecto funciona completo sin
tocar ninguna cuenta externa.

## Antes de empezar

| | |
|---|---|
| **Node.js** | 20 o superior |
| **pnpm** | `npm install -g pnpm` |
| **Docker** | para la base de datos ([Docker Desktop](https://www.docker.com/products/docker-desktop/)) |

## Puesta en marcha

```bash
pnpm install
pnpm setup:local    # crea tu archivo de configuración local
pnpm db:up          # levanta la base de datos
pnpm db:reset       # crea las tablas y carga las categorías
```

Y después, en **dos terminales**:

```bash
pnpm dev:services   # los servicios simulados
pnpm dev            # la app
```

Listo: [localhost:3000](http://localhost:3000).

La primera vez `db:up` descarga la imagen de Postgres y puede tardar un minuto.
Después arranca en segundos.

## Entrar a la app

En el diálogo de inicio de sesión vas a ver dos botones que solo existen en
desarrollo: **Google (emulador local)** y **Discord (stub local)**. No piden
contraseña ni salen a internet: elegís con qué cuenta de prueba querés entrar.

Las cuentas disponibles son:

| Cuenta | Para qué sirve |
|---|---|
| `admin@alquimia.dev` | Es administrador. Con esta ves el panel de moderación. |
| `brian@alquimia.dev` | Usuario común. |
| `maria@alquimia.dev` | Usuario común. |

Quién es administrador lo decide `ADMIN_EMAILS` en tu `.env.local`, que por
defecto trae `admin@alquimia.dev`. Si querés que otra cuenta lo sea, agregá su
mail a esa lista y volvé a iniciar sesión con ella: el rol se sincroniza en cada
login. Para entrar con una cuenta propia hace falta que exista también en
`emulate.config.yaml`, que sí se versiona: no pongas ahí mails personales.

`ADMIN_EMAILS` es un piso, no la única fuente: promueve, pero nunca degrada. Los
roles que se asignen desde el panel de Better Auth (`@better-auth/infra`) se
mantienen.

## Probar el badge de Alquimista

El badge se gana verificando que sos parte del Discord de la comunidad, y hace que
tus apoyos valgan doble. En local eso está simulado.

Andá a **Mi cuenta** → **Vincular Discord**. El stub te ofrece tres cuentas:
`brian` y `maria` figuran como miembros del servidor, `forastero` no. Elegí una y
volvé: si es miembro, ya tenés el badge.

Para simular que alguien se va del servidor y ver cómo el badge se cae solo:

```bash
curl http://localhost:4100/__dev/toggle-member/brian
```

Después tocá **Revalidar ahora** en tu cuenta. Vas a ver cómo el badge desaparece
y los apoyos que habías dado vuelven a valer uno.

La verificación además vence a los 7 días: pasado ese plazo el voto vuelve a
valer uno solo, y la próxima vez que entres a **Mi cuenta** se revalida sola.

## Ver los mails

Ningún mail sale a internet en desarrollo: los intercepta el emulador. Para ver
los que ya se enviaron:

```bash
pnpm inbox          # los lista
pnpm inbox --open   # además abre el último en el navegador
```

Si estás trabajando en el diseño de un mail, el preview se actualiza mientras
editás y trae verificador de compatibilidad entre clientes y test de spam:

```bash
pnpm email:dev      # http://localhost:3001
```

Las plantillas están en `emails/`. El logo y los colores salen de
`emails/components/layout.tsx`, que envuelve a todas.

## Las imágenes que subas

Los logos que cargues quedan en `.dev-uploads/`, en tu propia máquina, y se
sirven por `/api/dev-uploads/`. Esa carpeta no se versiona.

`pnpm dev` **nunca** escribe en el Vercel Blob de producción, tengas o no un
`BLOB_READ_WRITE_TOKEN` en tu `.env.local`. Solo se usa en los deploys.

Un logo solo puede apuntar a un archivo que hayamos subido nosotros: no se
puede pegar la URL de una imagen alojada en otro sitio.

## Better Auth Infra

El panel de usuarios y el anti-abuso (`@better-auth/infra`) corren **solo en
producción**. En local quedan apagados aunque tengas `BETTER_AUTH_API_KEY` en
tu `.env.local`, y es a propósito: `sentinel()` rechaza el alta cuando no puede
validar, así que una key de prueba bloquearía todos los registros locales.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | La app en modo desarrollo |
| `pnpm dev:services` | Los servicios simulados (Google, Discord, mails) |
| `pnpm check` | Revisa formato, calidad de código y traducciones |
| `pnpm fix` | Arregla automáticamente lo que se pueda |
| `pnpm build` | Compila como si fuera producción |
| `pnpm db:up` / `pnpm db:down` | Prende y apaga la base de datos |
| `pnpm db:reset` | Rehace las tablas y recarga las categorías |
| `pnpm db:studio` | Explorador visual de la base |
| `pnpm inbox` | Lista los mails enviados en local |
| `pnpm email:dev` | Preview y edición de las plantillas de mail |

## Tocar la base de datos

Si cambiás algo en `lib/db/schema/`, generá la migración y aplicala:

```bash
pnpm db:generate    # crea el archivo de migración
pnpm db:migrate     # lo aplica
```

El archivo generado en `drizzle/` **se commitea**: es lo que mantiene todas las
bases en sincronía.

## Agregar textos

Ningún texto que ve el usuario va escrito dentro de un componente. Todos viven en
`messages/es.json` y `messages/en.json`, y siempre tienen que estar en los dos
idiomas. `pnpm check` avisa si falta alguno o si quedó una clave mal escrita.

## Si algo no arranca

**«Cannot connect to the Docker daemon»** — Docker Desktop no está abierto.

**La app arranca pero da error de base de datos** — falta `pnpm db:reset`.

**«port is already allocated» al hacer `db:up`** — ya tenés otro Postgres en el
puerto 55432. Apagalo o cambiá el puerto en `DATABASE_URL`.

**Los botones de emulador no aparecen** — solo existen fuera de producción.
Asegurate de estar corriendo `pnpm dev` y no `pnpm build && pnpm start`.

**El login se queda cargando** — falta `pnpm dev:services` en la otra terminal.

## Cómo se despliega

No hace falta que hagas nada: al abrir un Pull Request se genera una preview
automática, y al mergear a `main` se publica en producción.

El build corre `drizzle-kit migrate` antes de compilar, así que las migraciones
pendientes se aplican solas en cada deploy. Si una falla, falla el build y no se
publica nada.

Dos cosas que se siguen de eso:

- **Los previews también migran.** Si apuntan a la misma base que producción, un
  PR con una migración la aplica ahí. Para evitarlo, que los previews usen una
  base aparte.
- **Cuidado con los cambios que rompen.** La migración corre antes de que el
  código nuevo esté publicado, así que por unos segundos la versión anterior
  corre contra la base ya migrada. Si vas a borrar o renombrar una columna que
  el código viejo todavía usa, partilo en dos merges: primero el que agrega,
  después el que borra.

La configuración de los servicios reales (base de datos, cuentas, mails,
imágenes) la mantiene el equipo desde Vercel y no hace falta tocarla para
desarrollar.

## Agregar textos

Ningún texto que ve el usuario va escrito dentro de un componente. Todos viven en
`messages/es.json` y `messages/en.json`, y siempre tienen que estar en los dos
idiomas. `pnpm check` avisa si falta alguno o si quedó una clave mal escrita.

## Si algo no arranca

**«Cannot connect to the Docker daemon»** — Docker Desktop no está abierto.

**La app arranca pero da error de base de datos** — falta `pnpm db:reset`.

**«port is already allocated» al hacer `db:up`** — ya tenés otro Postgres en el
puerto 55432. Apagalo o cambiá el puerto en `DATABASE_URL`.

**Los botones de emulador no aparecen** — solo existen fuera de producción.
Asegurate de estar corriendo `pnpm dev` y no `pnpm build && pnpm start`.

**El login se queda cargando** — falta `pnpm dev:services` en la otra terminal.

## Cómo se despliega

**Preview:** al abrir un Pull Request, Vercel genera una automática. No corre
migraciones.

**Producción:** al mergear a `main` corre `.github/workflows/deploy-production.yml`,
que hace todo en orden y se detiene ante el primer error:

1. `pnpm check` — formato, lint y traducciones.
2. Trae las variables de producción desde Vercel.
3. Verifica que no falte ninguna (`scripts/check-production-env.mjs`).
4. Aplica las migraciones pendientes.
5. Compila y publica.

Si algo falla antes del paso 5, no se publica nada. Las migraciones corren
antes que el deploy, así que el código nuevo nunca se encuentra con una base
sin migrar.

El deploy automático de Vercel para `main` está apagado en `vercel.json`: lo
maneja el workflow para poder migrar primero.

### Configuración necesaria

Las variables viven en Vercel, que es la única fuente de verdad. El workflow
las lee de ahí, no las guarda en el repo.

En GitHub (Settings → Secrets → Actions) hacen falta tres:

| Secreto | De dónde sale |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` después de `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` después de `vercel link` |

El job usa el entorno `production` de GitHub: si querés que un deploy requiera
aprobación manual, se configura ahí (Settings → Environments → production).

### Al agregar una migración

El workflow la aplica antes de publicar, así que durante unos segundos la
versión anterior de la app corre contra la base ya migrada. Para cambios que
rompen (borrar o renombrar una columna que el código viejo todavía usa),
partilo en dos merges: primero el que agrega, después el que borra.
