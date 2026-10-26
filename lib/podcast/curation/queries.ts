import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { podcastCurationRun } from "@/lib/db/schema";
import { CURATION_CONFIG } from "./config";

export type CurationRunView = NonNullable<
  Awaited<ReturnType<typeof getLatestCurationRun>>
>;
export type CandidateView = CurationRunView["candidates"][number];

const sourcePriority = new Map(
  CURATION_CONFIG.sources.map((source, index) => [source.id, index])
);

function compareRest(a: CandidateView, b: CandidateView): number {
  const priority =
    (sourcePriority.get(a.source) ?? Number.MAX_SAFE_INTEGER) -
    (sourcePriority.get(b.source) ?? Number.MAX_SAFE_INTEGER);
  if (priority !== 0) {
    return priority;
  }
  if (a.signal !== null && b.signal !== null && a.signal !== b.signal) {
    return b.signal - a.signal;
  }
  return b.publishedAt.getTime() - a.publishedAt.getTime();
}

export async function getLatestCurationRun() {
  const run = await db.query.podcastCurationRun.findFirst({
    orderBy: desc(podcastCurationRun.createdAt),
    with: { candidates: true },
  });

  if (!run) {
    return null;
  }

  const top = run.candidates
    .filter((candidate) => candidate.topPosition !== null)
    .sort((a, b) => (a.topPosition ?? 0) - (b.topPosition ?? 0));
  const rest = run.candidates
    .filter((candidate) => candidate.topPosition === null)
    .sort(compareRest);

  return { ...run, candidates: run.candidates, top, rest };
}
