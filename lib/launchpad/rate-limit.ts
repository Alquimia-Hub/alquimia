import "server-only";
import { lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/db/schema";

export async function consumeRateLimit(
  scope: string,
  subject: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `${scope}:${subject}:${windowStart}`;

  const [row] = await db
    .insert(rateLimit)
    .values({ key, count: 1, expiresAt: windowStart + windowMs })
    .onConflictDoUpdate({
      target: rateLimit.key,
      set: { count: sql`${rateLimit.count} + 1` },
    })
    .returning({ count: rateLimit.count });

  return (row?.count ?? 1) <= limit;
}

const CLEANUP_ODDS = 100;

export async function pruneRateLimits() {
  if (Math.floor(Math.random() * CLEANUP_ODDS) !== 0) {
    return;
  }

  await db.delete(rateLimit).where(lt(rateLimit.expiresAt, Date.now()));
}
