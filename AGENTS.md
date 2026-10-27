# Alquimia

Sitio de la comunidad: landing y Launchpad. Next.js (App Router), Drizzle + Neon,
Better Auth y next-intl. Contexto en `README.md`, entorno local en
`docs/desarrollo-local.md` y vocabulario del dominio en `GLOSSARY.md`.

## Flujo de trabajo

1. **Branch** desde `main` (`feat/…`, `fix/…`, `docs/…`). Nunca se commitea en `main`.
2. **Aclarar.** Si el pedido tiene decisiones abiertas, usar el skill `grilling`
   antes de planear. Los hechos se buscan en el repo; al usuario solo se le
   preguntan decisiones.
3. **Spec.** Todo cambio no trivial (feature, cambio de comportamiento, schema
   de base de datos) pasa por los skills de OpenSpec:
   `openspec-explore` (opcional) → `openspec-propose` → aprobación del usuario →
   `openspec-apply-change` → `openspec-verify-change` → `openspec-archive-change`.
   No se implementa sin propuesta aprobada. Fixes chicos, copy y docs van directo.
4. **Verificar.** `pnpm check` y `pnpm exec tsc --noEmit` tienen que pasar.
   Cada cambio en la app se comprueba con `next dev` corriendo usando el skill
   `next-dev-loop`: `/_next/mcp` (errores de compilación y de runtime, rutas) y
   `agent-browser` (lo que ve el usuario). Si hay cambios de UI, se miran en el
   navegador.
5. **Commit.** Conventional Commits en español: `tipo(área): descripción`, por
   ejemplo `feat(launchpad): …`.
6. **PR** a `main`, con el cuerpo escrito con el skill `pr`. Vercel arma la
   preview, y al mergear se despliega a producción.

Si hay pasos que solo puede hacer una persona (credenciales, dashboards,
migraciones únicas), se arma un script con el skill `wizard` en lugar de
explicarlos en el chat.

## Reglas

- Los textos visibles van en `messages/es.json` y `messages/en.json`, siempre en
  los dos idiomas. `pnpm check` lo valida.
- En el código y en la copy se usan los términos de `GLOSSARY.md`.
- El formato y el lint los resuelve Ultracite (Biome) con `pnpm fix`.
- Los cambios de schema llevan su migración en `drizzle/` (`pnpm db:generate`).
  Las migraciones corren solas en el build de producción.
- Para desarrollar no hacen falta credenciales reales: `pnpm dev:services`
  levanta los emuladores.
- El código va en inglés. Docs, specs, commits y PRs, en español.
- El plan del podcast está en `docs/podcast.md`.

## Agentes

Este archivo es la única fuente de instrucciones para cualquier coding agent.
Codex, Cursor, Copilot, Amp y los demás lo leen directamente. Claude Code lo
lee a través de `CLAUDE.md`, que lo importa, y Gemini CLI a través de
`.gemini/settings.json`.

- Los skills viven en `.agents/skills`, el directorio que usan casi todos los
  agentes. Para Claude Code se enlazan en `.claude/skills`. Se instalan con
  `npx skills add <repo>`, que también actualiza `skills-lock.json`.
- Los skills de OpenSpec se regeneran con `openspec config set delivery skills`
  y después `openspec init --tools claude,agents`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
