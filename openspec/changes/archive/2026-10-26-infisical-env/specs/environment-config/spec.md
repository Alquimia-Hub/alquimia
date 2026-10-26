# Spec Delta

## Purpose

Define de dónde salen las variables de entorno de cada entorno de Alquimia
(local, preview y producción), cómo llegan a cada uno y quién puede cambiarlas.

## ADDED Requirements

### Requirement: Infisical es la fuente de verdad de los entornos desplegados
Toda variable que necesiten los deploys de Vercel SHALL estar cargada en el
proyecto Alquimia de Infisical Cloud. El entorno Development de Infisical
corresponde a Preview de Vercel y Production a Production. Las variables que
inyecta una integración de Vercel (Vercel Blob) quedan fuera.

#### Scenario: Cambiar un valor de producción
- **WHEN** alguien del equipo cambia `RESEND_API_KEY` en el entorno Production de Infisical
- **THEN** el valor nuevo aparece en el entorno Production de Vercel sin que nadie corra ningún comando

#### Scenario: Variable nueva para previews
- **WHEN** se agrega una variable al entorno Development de Infisical
- **THEN** la variable aparece en el entorno Preview de Vercel y no en Production

### Requirement: Los deploys leen las variables sincronizadas
Cada build y runtime de Vercel SHALL recibir las variables de su entorno sin
pasos manuales. Las migraciones del build (`drizzle-kit migrate`) SHALL ver el
`DATABASE_URL` de su entorno.

#### Scenario: Deploy de producción
- **WHEN** se mergea a `main`
- **THEN** el build de producción corre con las variables del entorno Production de Infisical y migra la base de producción

#### Scenario: Preview de un PR
- **WHEN** se abre un Pull Request
- **THEN** el preview corre con las variables del entorno Development de Infisical y nunca con las de producción

### Requirement: La sincronización no borra variables ajenas
La sincronización desde Infisical MUST NOT borrar de Vercel variables que no
estén en Infisical.

#### Scenario: Token de Vercel Blob
- **WHEN** Infisical sincroniza Production a Vercel
- **THEN** `BLOB_READ_WRITE_TOKEN`, que crea la integración de Vercel Blob, sigue en Vercel con su valor

### Requirement: Desarrollo local sin credenciales
El setup local por defecto SHALL funcionar sin cuenta en Infisical ni
credenciales reales, usando los emuladores.

#### Scenario: Contribuidor nuevo
- **WHEN** alguien sin acceso a Infisical corre `pnpm setup:local` y sigue `docs/desarrollo-local.md`
- **THEN** la app levanta completa en `localhost:3000` con los servicios simulados

### Requirement: Setup opcional con Infisical para el equipo
Un miembro del equipo con acceso al proyecto SHALL poder bajar el entorno
Development de Infisical a su `.env.local` con un solo comando guiado, sin
pedirle valores a nadie por chat.

#### Scenario: Primer setup con Infisical
- **WHEN** alguien con acceso corre `pnpm setup:infisical`
- **THEN** el wizard verifica el CLI, inicia sesión en Infisical Cloud y deja en `.env.local` las variables de Development

#### Scenario: Ya existe un .env.local
- **WHEN** corre `pnpm setup:infisical` y ya tiene un `.env.local`
- **THEN** el wizard pide confirmación antes de reemplazarlo y guarda una copia del anterior

#### Scenario: Sin acceso al proyecto
- **WHEN** alguien inicia sesión pero no es miembro del proyecto Alquimia en Infisical
- **THEN** el wizard termina con un mensaje que explica a quién pedir acceso y no modifica `.env.local`

### Requirement: No hay secretos en el repositorio
El repositorio MUST NOT contener valores de variables. Solo se versionan los
nombres (`.env.example`) y el identificador público del proyecto de Infisical.

#### Scenario: Revisión del repo
- **WHEN** se buscan valores de secretos en los archivos versionados
- **THEN** solo aparecen nombres de variables y el `workspaceId` de `.infisical.json`

