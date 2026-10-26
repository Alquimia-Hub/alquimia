# Design

## Context

- El proyecto Alquimia ya existe en Infisical Cloud (`app.infisical.com`) con
  dos entornos, Development y Production, y ocho secretos. Faltan algunos que
  el código lee y sobra `WEBSITE_URL` (ver proposal.md).
- Vercel tiene hoy las variables que se subieron con `scripts/vercel-env-push.sh`
  desde `.env.preview` y `.env.production`, dos archivos locales de una sola
  persona. `BLOB_READ_WRITE_TOKEN` lo agrega la integración de Vercel Blob.
- El build de Vercel es `drizzle-kit migrate && next build`: las migraciones
  corren dentro del build y necesitan `DATABASE_URL` en ese momento.
- Varias variables se derivan en el código y no se cargan en ningún lado:
  `BETTER_AUTH_URL` y `NEXT_PUBLIC_SITE_URL` (`lib/site-url.ts`),
  `EMAIL_ASSETS_URL` (`lib/mail/send.ts`) y los `NEXT_PUBLIC_*` de
  `next.config.mjs`.
- En local, `drizzle.config.ts` y los scripts `db:seed`, `dev:discord` e
  `inbox` leen `.env.local` directamente con `--env-file`.

## Goals / Non-Goals

**Goals:**

- Cambiar un valor en Infisical alcanza para que el próximo deploy lo use.
- Ningún secreto de producción sale de Infisical y Vercel.
- El setup para el equipo es un comando guiado.

**Non-Goals:**

- Que `pnpm dev` dependa de Infisical: el camino por defecto sigue siendo con
  emuladores.
- Un entorno de Infisical por desarrollador.
- Sincronizar el entorno Development de Vercel, que nadie usa.
- Rotar los secretos actuales: se migran con los valores que tienen.

## Decisions

### Vercel Secret Sync con Auto-Sync

Infisical escribe las variables en Vercel cada vez que cambian, y Vercel las
inyecta en el build y en el runtime como cualquier variable propia. Hay dos
syncs: Development → Preview (sin branch, aplica a todos los previews) y
Production → Production.

Alternativas descartadas:
- **`infisical run -- next build` en el build de Vercel:** obliga a guardar en
  Vercel una credencial de Infisical que lee producción, el build depende de que
  Infisical esté disponible y las variables solo existen en el build: el runtime
  de las funciones no las ve sin una segunda inyección.
- **Seguir con `vercel env add` desde un script:** es lo que hay hoy. Depende de
  que alguien lo corra y de archivos locales.

### «Overwrite Destination Secrets» + «Disable Secret Deletion», después de completar Infisical

Primero se cargan en Infisical las variables faltantes y después se crean las
syncs con estas opciones:
- **Overwrite Destination Secrets:** Infisical gana en cada clave que tiene.
  Se descartan las opciones de import porque Vercel no devuelve el valor de las
  variables sensibles: entrarían vacías a Infisical. Además, el token de Blob
  terminaría en Infisical, que pasaría a pisar lo que maneja la integración.
- **Disable Secret Deletion:** la sync no borra de Vercel lo que no esté en
  Infisical, y así `BLOB_READ_WRITE_TOKEN` queda intacto. El costo es que, si se
  borra una variable en Infisical, hay que borrarla también a mano en Vercel.
- **Key Schema:** no se usa. Los nombres en Vercel son los mismos que en
  Infisical y el código no cambia.
- **Mark Secrets as Sensitive:** activado. Las variables que la sync crea en
  Vercel no se pueden leer después ni desde el dashboard ni por la API; las que
  ya existían conservan su tipo. Vercel no admite Sensitive en Development, y
  ese entorno no se sincroniza.

### App Connection con un token de Vercel de cuenta completa

El token se crea en Vercel (Account Tokens) con Scope «Full Account» y sin
vencimiento: si vence, las syncs se cortan en silencio. Tiene que ser de
cuenta completa porque Infisical valida la conexión contra `/v2/user`, y Vercel
rechaza esa llamada con tokens de team o de proyecto. Es un token amplio:
queda guardado cifrado en Infisical, solo en esta App Connection, y se revoca
desde Vercel si hace falta. La App Connection se crea en el proyecto Alquimia de Infisical
(Integrations → App Connections), no a nivel de organización.

### Dos formas de autenticarse: Machine Identity para el admin, usuario para el equipo

- **Admin y agentes:** una Machine Identity `alquimia-admin` con Universal
  Auth. Su `client_id`, su `client_secret` y el `project_id` se guardan en el
  keyring del sistema, en el servicio `alquimia-infisical`. Cada comando saca
  un token temporal con
  `infisical login --method=universal-auth --domain https://app.infisical.com/api --silent --plain`
  y lo pasa por `INFISICAL_TOKEN`. La sesión de usuario del CLI no se toca, así
  que no choca con otras instancias de Infisical que use la persona. La
  identity arranca con rol Admin en el proyecto para cargar los secretos de la
  migración y después baja a Viewer.
- **Equipo:** cada persona entra con su cuenta (`infisical login` dentro del
  wizard). No se comparte el secreto de ninguna identity, y el acceso de cada
  uno se da o se quita desde Infisical.

Se descarta una identity compartida por todo el equipo: habría que repartir su
secreto y no quedaría registro de quién leyó qué.

### El setup del equipo exporta a `.env.local` en lugar de envolver `pnpm dev`

`pnpm setup:infisical` corre `infisical export --env=dev --format=dotenv` sobre
`.env.local`. Se descarta `infisical run -- pnpm dev` porque `drizzle.config.ts`
y los scripts con `--env-file=.env.local` no lo verían, y habría que envolver
cada comando. El costo es un archivo en texto plano en disco, que ya es el caso
hoy y está gitignoreado. Para actualizarlo se vuelve a correr el wizard.

El wizard pasa `--domain https://app.infisical.com/api` en cada comando, así
que funciona aunque la persona use el CLI contra otra instancia de Infisical.

### `.infisical.json` versionado

Tiene solo el `workspaceId` del proyecto, que no es un secreto. Con eso nadie
corre `infisical init`. `.gitignore` hoy ignora `.env*` pero no este archivo,
así que no hay que cambiarlo.

### Wizards con la librería del skill `wizard`

- `scripts/setup-infisical.sh` (versionado, `pnpm setup:infisical`): para el
  equipo.
- Dos wizards de una sola vez para el admin, no versionados (fuera del repo),
  porque entre uno y otro hay que completar Infisical:
  1. **Identity:** crea `alquimia-admin` y guarda sus credenciales en el keyring.
  2. **Vercel:** token, App Connection y las dos syncs, y termina con un
     redeploy de producción para verificar.

## Risks / Trade-offs

- [Un cambio en Infisical no se aplica hasta el próximo deploy] → La doc lo
  dice. Para aplicarlo ya, redeploy desde Vercel.
- [Development alimenta los previews y también los `.env.local` del equipo, y
  apunta al branch `dev` de Neon] → Un `pnpm db:migrate` local migra la base de
  los previews. La doc lo avisa, y el wizard recomienda `pnpm db:up` (Postgres
  local) si no se necesita la base compartida.
- [Una variable borrada en Infisical sigue en Vercel] → El checklist para
  borrar variables en la doc incluye borrarla en Vercel.
- [Las syncs se pueden romper sin que nadie se entere: token revocado, plan] →
  Infisical muestra el estado de cada sync y avisa los errores. El wizard del
  admin verifica el estado después de crearlas.
- [Infisical Cloud no responde] → Vercel conserva las últimas variables
  sincronizadas: los deploys siguen funcionando.

## Migration Plan

1. El admin corre el wizard de la identity.
2. Cargar en Infisical las variables faltantes desde `.env.production` y
   `.env.preview` y borrar `WEBSITE_URL`.
3. Comparar los nombres de Development y Production contra `lib/env.ts`.
4. El admin corre el wizard de Vercel: token, App Connection, sync de Preview
   y sync de Production.
5. Redeploy de producción y de un preview, verificando login, mails y base.
6. Mergear el código: wizard del equipo, docs y borrado de `vercel-env-push.sh`.
7. El admin borra sus `.env.preview` y `.env.production` locales y baja la
   identity `alquimia-admin` a Viewer.

Rollback: borrar las syncs en Infisical. Las variables quedan en Vercel con el
último valor sincronizado y `scripts/vercel-env-push.sh` se recupera del
historial de git.
