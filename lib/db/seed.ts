import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { CATEGORIES } from "@/lib/launchpad/categories";
import { category } from "./schema";

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Falta DATABASE_URL");
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { casing: "snake_case" });

  await db
    .insert(category)
    .values(
      CATEGORIES.map((item, index) => ({ id: item.id, sortOrder: index }))
    )
    .onConflictDoUpdate({
      target: category.id,
      set: { sortOrder: category.sortOrder },
    });

  process.stdout.write(`Sembradas ${CATEGORIES.length} categorias\n`);
  await client.end();
}

seed().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
