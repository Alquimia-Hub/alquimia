import { execFile } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";

const baseUrl = process.env.RESEND_BASE_URL;
const apiKey = process.env.RESEND_API_KEY;

if (!baseUrl) {
  process.stderr.write(
    "RESEND_BASE_URL no esta definido: los mails salen a Resend de verdad, no al emulador.\n"
  );
  process.exit(1);
}

const response = await fetch(`${baseUrl}/emails`, {
  headers: { Authorization: `Bearer ${apiKey}` },
}).catch(() => null);

if (!response?.ok) {
  process.stderr.write(
    `No pude leer el emulador en ${baseUrl}. Esta corriendo \`pnpm dev:services\`?\n`
  );
  process.exit(1);
}

const { data = [] } = await response.json();

if (data.length === 0) {
  process.stdout.write("Todavia no se envio ningun mail.\n");
  process.exit(0);
}

process.stdout.write(`\n${data.length} mails capturados:\n\n`);

for (const [index, email] of data.entries()) {
  process.stdout.write(
    `  ${String(index + 1).padStart(2)}. ${email.subject}\n` +
      `      para ${email.to.join(", ")}\n`
  );
}

const last = data.at(-1);
const file = path.join(tmpdir(), `alquimia-mail-${last.id}.html`);
writeFileSync(file, last.html ?? "");

process.stdout.write(`\nUltimo mail guardado en:\n  ${file}\n`);

if (process.argv.includes("--open")) {
  execFile("open", [file]);
  process.stdout.write("Abriendolo en el navegador…\n");
} else {
  process.stdout.write("Agrega --open para verlo en el navegador.\n");
}
