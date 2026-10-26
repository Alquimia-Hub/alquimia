# Tasks

## 1. Base y configuración

- [x] 1.1 Sumar `fast-xml-parser` con `pnpm add` y verificar que `pnpm install` queda limpio
- [x] 1.2 Crear `lib/podcast/curation/config.ts` y `types.ts` con `CURATION_CONFIG` validado con zod (fuentes en orden de prioridad, topes, `maxCandidates`, `topSize`, `defaultWindowDays`, `sourceTimeoutMs`) y verificar con `pnpm exec tsc --noEmit`
- [x] 1.3 Agregar `lib/db/schema/podcast.ts` (`podcast_curation_run`, `podcast_candidate` y el enum de estado), exportarlo en `schema/index.ts`, generar la migración con `pnpm db:generate` y verificar que `pnpm db:migrate` corre contra la base local

## 2. Pipeline y fuentes

- [x] 2.1 Implementar `url.ts` (`normalizeUrl`) y verificar con un script de `tsx` los casos de la spec: `www`, barra final, fragmento, `utm_*`, versión de arXiv y mayúsculas en GitHub
- [x] 2.2 Implementar las fuentes `hn`, `github` (stars con `starred_at`), `arxiv`, `biorxiv` (API con `?category=`) y `rss`, cada una con timeout y filtro por ventana, y verificar con `--dry-run` que cada una devuelve ítems dentro de la ventana
- [x] 2.3 Implementar `pipeline.ts`: juntar con `Promise.allSettled`, deduplicar por prioridad, excluir URLs de tops previos y armar el round-robin con topes. Verificar con `--dry-run` que se respetan los topes y que una fuente con un host inválido aparece como fallida sin cortar la corrida
- [x] 2.4 Implementar `run.ts` y `queries.ts` (ventana desde la última corrida `completed`, guardar la corrida y los candidatos, `failed` si fallan todas) y verificar que dos corridas seguidas sin `--dry-run` encadenan las ventanas y que la segunda no repite URLs del primer top
- [x] 2.5 Crear `scripts/podcast-curation.ts` y el script `podcast:curation` en `package.json` con `--dry-run` y `--days`, y verificar que con `--dry-run` la base no cambia

## 3. Panel

- [x] 3.1 Implementar la server action `curateCandidates()` con `requireAdmin()` y `ActionResult`, y verificar que un usuario sin rol admin recibe `forbidden` y no se crea ninguna corrida
- [x] 3.2 Crear `app/[locale]/admin/podcast/page.tsx` (sesión, 404 para quien no es admin, `maxDuration = 60`) con el botón Curar, el aviso de fuentes fallidas, la tabla del top y el resto colapsado. Sumar los textos `PodcastAdmin` en `es` y `en`, y verificar en el navegador en los dos idiomas
- [x] 3.3 Sumar el link al panel del podcast en `components/auth/user-menu.tsx` y en `/account`, solo para admins, y verificar en el navegador que no aparece para un usuario común

## 4. Docs

- [x] 4.1 Actualizar `docs/podcast.md` (curación manual desde `/admin/podcast`, sin cron ni Discord por ahora, antes o en paralelo al episodio 0, fuentes y dónde se configuran) y `GLOSSARY.md` (Corrida, Fuente, Top), y verificar que los términos coinciden con el código

## 5. Integración

- [x] 5.1 Correr `pnpm check` y `pnpm exec tsc --noEmit` sin errores
- [x] 5.2 Con `pnpm dev`, apretar Curar como admin y verificar de punta a punta: la corrida se guarda, el top respeta los topes y la página muestra la ventana y las fuentes fallidas

## Workflow follow-up

- Verificar con `openspec-verify-change` y archivar con `openspec-archive-change`.
- Rebasear `feat/podcast-curacion` sobre `main` cuando se mergee el PR #14.
- Abrir el PR con el skill `pr` y probar Curar en el preview de Vercel.
