import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import process from "node:process";

const ENV_FILE = ".env.local";

const TEMPLATE = `# Entorno de desarrollo local. Este archivo no se versiona.
# Generado por 'pnpm setup:local'. Ver docs/desarrollo-local.md

# Postgres en Docker. Levantarlo con: pnpm db:up
DATABASE_URL=postgresql://alquimia:alquimia@localhost:55432/alquimia_dev

# Firma las sesiones. Generado al azar para esta maquina.
BETTER_AUTH_SECRET=${randomBytes(32).toString("base64url")}

# Quien entra como administrador. Cambialo por el mail con el que vas a
# iniciar sesion si queres ver el panel de moderacion.
ADMIN_EMAILS=admin@alquimia.dev

# Mails: los recibe el emulador local, no salen a internet.
RESEND_API_KEY=re_alquimia_local
RESEND_FROM_EMAIL="Alquimia <hola@alquimia.dev>"
RESEND_ADMIN_EMAIL=equipo@alquimia.dev
RESEND_BASE_URL=http:

# Sin token, los logos que subas quedan en public/dev-uploads/
BLOB_READ_WRITE_TOKEN=
`;

if (existsSync(ENV_FILE)) {
  process.stdout.write(`${ENV_FILE} ya existe, no lo toco.\n`);
} else {
  writeFileSync(ENV_FILE, TEMPLATE);
  process.stdout.write(`${ENV_FILE} creado.\n`);
}

process.stdout.write(
  "\nSiguiente paso:\n" +
    "  pnpm db:up          levanta Postgres en Docker\n" +
    "  pnpm db:reset       crea las tablas y las categorias\n" +
    "  pnpm dev:services   emuladores de Google, Discord y mails\n" +
    "  pnpm dev            la app en http://localhost:3000\n"
);
