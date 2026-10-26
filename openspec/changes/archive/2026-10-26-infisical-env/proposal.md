# Proposal

## Why

Las variables de entorno de Alquimia viven hoy en archivos `.env.preview` y
`.env.production` en la máquina de una sola persona, en texto plano, y se suben
a Vercel a mano con `pnpm vercel:env`. No hay una fuente de verdad compartida,
nadie más del equipo puede ver o rotar un valor, y Vercel queda desincronizado
cada vez que alguien se olvida de correr el script. Ya existe un proyecto
Alquimia en Infisical Cloud con parte de las variables cargadas: falta
completarlo y hacer que sea él quien alimente los deploys.

## What Changes

- Infisical Cloud (`app.infisical.com`, proyecto Alquimia) pasa a ser la única
  fuente de verdad de las variables de los entornos desplegados. Su entorno
  Development alimenta los previews de Vercel y Production alimenta producción.
- Vercel recibe las variables por Secret Sync de Infisical con Auto-Sync: un
  cambio en Infisical llega a Vercel sin pasos manuales y el próximo deploy lo
  usa. Las variables que maneja Vercel por su cuenta (`BLOB_READ_WRITE_TOKEN`
  de la integración de Vercel Blob) no se tocan.
- Se completan en Infisical las variables que el código usa y hoy faltan
  (`BETTER_AUTH_SECRET`, `BETTER_AUTH_API_KEY`, `BETTER_AUTH_API_URL`,
  `BETTER_AUTH_KV_URL`, `RESEND_FROM_EMAIL`, `RESEND_ADMIN_EMAIL`,
  `ADMIN_EMAILS`) y se borra `WEBSITE_URL`, que ningún código lee.
- Nuevo `pnpm setup:infisical`: un wizard opcional para el equipo que instala
  o verifica el CLI de Infisical, inicia sesión y baja el entorno Development a
  `.env.local`. El `workspaceId` del proyecto se versiona en `.infisical.json`.
- `pnpm setup:local` con emuladores sigue siendo el camino por defecto: para
  contribuir no hace falta cuenta en Infisical.
- Un wizard de una sola vez, no versionado, guía al admin para crear el token
  de Vercel, la App Connection y las dos Secret Syncs.
- **BREAKING (para el equipo):** se borran `scripts/vercel-env-push.sh` y el
  script `vercel:env`. Las variables ya no se suben a Vercel a mano.
- `docs/desarrollo-local.md` se corrige: la sección de deploy está duplicada y
  describe un workflow de GitHub Actions que no existe.

## Capabilities

### New Capabilities

- `environment-config`: de dónde salen las variables de entorno de cada
  entorno (local, preview, producción), cómo llegan a cada uno y quién puede
  cambiarlas.

### Modified Capabilities

Ninguna: no hay specs previas en `openspec/specs/`.

## Impact

- **Código y scripts:** `package.json` (suma `setup:infisical`, saca
  `vercel:env`), `scripts/setup-infisical.sh` nuevo, `.infisical.json` nuevo,
  `scripts/vercel-env-push.sh` eliminado.
- **Docs:** `docs/desarrollo-local.md` y `README.md`.
- **Sistemas externos:** proyecto Alquimia en Infisical Cloud (secretos nuevos,
  App Connection de Vercel, dos Secret Syncs) y variables del proyecto
  `alquimia` en Vercel (pasan a ser escritas por Infisical).
- **Sin cambios** en el código de la app: `lib/env.ts` y `lib/site-url.ts`
  siguen leyendo `process.env` igual que hoy.
