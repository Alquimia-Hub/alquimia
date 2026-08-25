import { existsSync } from "node:fs";
import process from "node:process";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Falta DATABASE_URL. Corre `pnpm setup:local` para crear .env.local"
  );
}

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
