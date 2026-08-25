import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const createClient = () =>
  postgres(env.DATABASE_URL, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
  });

const globalForDb = globalThis as unknown as {
  __alquimiaSql?: ReturnType<typeof createClient>;
};

const client = globalForDb.__alquimiaSql ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__alquimiaSql = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });

export { schema };
