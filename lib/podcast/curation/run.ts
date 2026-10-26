import { desc, eq, isNotNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { podcastCandidate, podcastCurationRun } from "@/lib/db/schema";
import { CURATION_CONFIG } from "./config";
import { curate } from "./pipeline";
import type { CurationResult, CurationWindow } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

interface RunOptions {
  /** Overrides the computed window. Meant for testing from the CLI. */
  days?: number;
  dryRun?: boolean;
  triggeredById?: string | null;
}

export interface RunOutcome {
  result: CurationResult;
  runId: string | null;
}

async function getWindow(now: Date, days?: number): Promise<CurationWindow> {
  if (days !== undefined) {
    return { start: new Date(now.getTime() - days * DAY_MS), end: now };
  }

  const [last] = await db
    .select({ windowEnd: podcastCurationRun.windowEnd })
    .from(podcastCurationRun)
    .where(eq(podcastCurationRun.status, "completed"))
    .orderBy(desc(podcastCurationRun.windowEnd))
    .limit(1);

  return {
    start:
      last?.windowEnd ??
      new Date(now.getTime() - CURATION_CONFIG.defaultWindowDays * DAY_MS),
    end: now,
  };
}

async function getPreviousTopUrls(): Promise<Set<string>> {
  const rows = await db
    .selectDistinct({ url: podcastCandidate.url })
    .from(podcastCandidate)
    .where(isNotNull(podcastCandidate.topPosition));
  return new Set(rows.map((row) => row.url));
}

export async function runCuration({
  days,
  dryRun = false,
  triggeredById = null,
}: RunOptions = {}): Promise<RunOutcome> {
  const [window, previousTopUrls] = await Promise.all([
    getWindow(new Date(), days),
    getPreviousTopUrls(),
  ]);

  if (dryRun) {
    const result = await curate({
      config: CURATION_CONFIG,
      previousTopUrls,
      window,
    });
    return { result, runId: null };
  }

  const runId = nanoid();
  await db.insert(podcastCurationRun).values({
    id: runId,
    windowStart: window.start,
    windowEnd: window.end,
    triggeredById,
  });

  try {
    const result = await curate({
      config: CURATION_CONFIG,
      previousTopUrls,
      window,
    });

    await db.transaction(async (tx) => {
      if (result.candidates.length > 0) {
        await tx.insert(podcastCandidate).values(
          result.candidates.map((candidate) => ({
            id: nanoid(),
            runId,
            source: candidate.source,
            url: candidate.url,
            title: candidate.title,
            publishedAt: candidate.publishedAt,
            signal: candidate.signal,
            topPosition: candidate.topPosition,
            metadata: candidate.metadata,
          }))
        );
      }
      await tx
        .update(podcastCurationRun)
        .set({
          status: result.status,
          sourceErrors: result.errors,
          finishedAt: new Date(),
        })
        .where(eq(podcastCurationRun.id, runId));
    });

    return { result, runId };
  } catch (error) {
    await db
      .update(podcastCurationRun)
      .set({
        status: "failed",
        sourceErrors: [
          {
            source: "run",
            message: error instanceof Error ? error.message : String(error),
          },
        ],
        finishedAt: new Date(),
      })
      .where(eq(podcastCurationRun.id, runId));
    throw error;
  }
}
