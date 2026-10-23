# Tasks

## 1. Acceso del admin con Machine Identity

- [x] 1.1 Escribir fuera del repo el wizard de la identity con la librería del skill `wizard`: crear `alquimia-admin` con Universal Auth, darle rol Admin en el proyecto Alquimia y guardar `client_id`, `client_secret` y `project_id` con `keyring set alquimia-infisical …`; verificar con `bash -n` y `shellcheck`
- [x] 1.2 El admin corre el wizard; verificar que un token sacado con `infisical login --method=universal-auth --domain https://app.infisical.com/api` lista los 8 secretos actuales de Production con `infisical secrets --env=prod --projectId <id>`

## 2. Completar Infisical

- [x] 2.1 Cargar en Production los que faltan desde `.env.production` (`BETTER_AUTH_SECRET`, `BETTER_AUTH_API_KEY`, `BETTER_AUTH_API_URL`, `BETTER_AUTH_KV_URL`, `RESEND_FROM_EMAIL`, `RESEND_ADMIN_EMAIL`, `ADMIN_EMAILS`) con confirmación previa del admin; verificar que `infisical secrets --env=prod` los lista
- [x] 2.2 Cargar en Development los que faltan desde `.env.preview` (los mismos, salvo los de Better Auth Infra, que solo corren en producción), completar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en Development (app de Google de dev) y borrar `WEBSITE_URL` de los dos entornos; verificar que ningún secreto de Development queda vacío
- [x] 2.3 Comparar los nombres de cada entorno con `lib/env.ts` y verificar que no falte ninguna variable requerida (`DATABASE_URL`, `BETTER_AUTH_SECRET`)

## 3. Wizard de Vercel para el admin (no versionado)

- [x] 3.1 Escribir el wizard fuera del repo con la librería del skill `wizard`: token de Vercel → App Connection → sync Development→Preview → sync Production→Production (Overwrite Destination Secrets, Disable Secret Deletion, Auto-Sync) → redeploy y verificación; verificar con `bash -n` y `shellcheck`
- [x] 3.2 El admin corre el wizard; verificar en Infisical que las dos syncs están en estado «Synced» y, con `npx vercel env ls production` y `preview`, que las claves coinciden con Infisical y que `BLOB_READ_WRITE_TOKEN` sigue en Vercel
- [x] 3.3 Redeploy de producción desde Vercel y verificar en el navegador que alquimia.community responde, que el login con Google funciona y que la base responde (Launchpad carga)

## 4. Setup del equipo

- [x] 4.1 Agregar `.infisical.json` con el `workspaceId` y verificar que `git check-ignore .infisical.json` no lo ignora
- [x] 4.2 Escribir `scripts/setup-infisical.sh` con la librería del skill `wizard`: verifica o instala el CLI, hace login de usuario en `app.infisical.com` (`--domain` en cada comando), chequea acceso al proyecto, respalda el `.env.local` existente con confirmación y exporta Development; verificar con `bash -n`, `shellcheck` y una corrida real que deje `.env.local` con las claves de Development
- [x] 4.3 Agregar `setup:infisical` a `package.json` y verificar que `pnpm setup:infisical` arranca el wizard

## 5. Limpieza y docs

- [x] 5.1 Borrar `scripts/vercel-env-push.sh` y el script `vercel:env` de `package.json`; verificar con `grep -rn "vercel-env-push\|vercel:env"` que no quedan referencias
- [x] 5.2 Reescribir la sección de deploy de `docs/desarrollo-local.md`: sacar la duplicación y el workflow inexistente, explicar Infisical como fuente de verdad, cómo agregar, cambiar y borrar una variable, que el cambio se aplica en el próximo deploy, y el riesgo de migrar la base compartida desde local
- [x] 5.3 Sumar a `docs/desarrollo-local.md` y `README.md` el camino opcional `pnpm setup:infisical` y verificar que los comandos documentados existen en `package.json`
- [x] 5.4 Correr `pnpm check` y `pnpm exec tsc --noEmit` y verificar que pasan

## Workflow follow-up

- El admin borra sus `.env.preview` y `.env.production` locales una vez verificado el deploy, y baja la identity `alquimia-admin` a Viewer.
- Correr `openspec-verify-change` y después `openspec-archive-change`.
