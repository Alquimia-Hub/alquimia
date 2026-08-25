#!/usr/bin/env bash
#
# Sube las variables de un archivo .env a un entorno de Vercel.
#
#   scripts/vercel-env-push.sh .env.production production
#   scripts/vercel-env-push.sh .env.preview    preview
#
# Requiere estar autenticado (`vercel login`) y con el proyecto linkeado
# (`vercel link`). Los archivos .env* estan gitignoreados.
#
set -euo pipefail

FILE="${1:-}"
TARGET="${2:-}"

# Usa el vercel instalado si existe; si no, cae a npx.
if command -v vercel >/dev/null 2>&1; then
  VERCEL="vercel"
else
  VERCEL="npx --yes vercel@latest"
fi

if [[ -z "$FILE" || -z "$TARGET" ]]; then
  echo "uso: $0 <archivo.env> <production|preview|development>" >&2
  exit 1
fi

if [[ ! -f "$FILE" ]]; then
  echo "no existe $FILE" >&2
  exit 1
fi

# Variables que NO se suben:
#  - las que solo existen en desarrollo (emuladores locales)
#  - las que inyecta sola la integracion de Vercel Blob
#  - BETTER_AUTH_URL, que se deriva en lib/site-url.ts
SKIP=(
  BETTER_AUTH_URL
  DISCORD_API_BASE
  RESEND_BASE_URL
  BLOB_READ_WRITE_TOKEN
  BLOB_STORE_ID
  NEXT_PUBLIC_SITE_URL
)

is_skipped() {
  local needle="$1"
  for item in "${SKIP[@]}"; do
    [[ "$item" == "$needle" ]] && return 0
  done
  return 1
}

# No dejar que se suban placeholders a medio completar.
if grep -q "PEGAR_" "$FILE"; then
  echo "Hay valores sin completar en $FILE:" >&2
  grep -n "PEGAR_" "$FILE" >&2
  exit 1
fi

echo "Subiendo variables de $FILE al entorno '$TARGET'."
echo

pushed=0
while IFS= read -r line || [[ -n "$line" ]]; do
  # ignorar comentarios y lineas vacias
  [[ -z "${line// }" || "$line" == \#* ]] && continue
  [[ "$line" != *=* ]] && continue

  key="${line%%=*}"
  value="${line#*=}"

  # sacar comillas envolventes si las hay
  value="${value%\"}"
  value="${value#\"}"

  if is_skipped "$key"; then
    echo "  omitida   $key"
    continue
  fi

  if [[ -z "$value" ]]; then
    echo "  vacia     $key"
    continue
  fi

  # `</dev/null` es obligatorio: sin eso el comando consume el stdin del `while
  # read` y el loop corta despues de la primera variable.
  if ! $VERCEL env add "$key" "$TARGET" --value "$value" --force --yes \
    </dev/null >/dev/null 2>&1; then
    echo "  FALLO     $key" >&2
    exit 1
  fi
  echo "  ok        $key"
  pushed=$((pushed + 1))
done < "$FILE"

echo
echo "$pushed variables subidas a '$TARGET'."
echo "Verificar con: npx vercel env ls $TARGET"
