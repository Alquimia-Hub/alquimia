import type { SourceConfig } from "../config";
import type { CurationWindow, SourceItem } from "../types";
import { byDateDesc, fetchJson } from "./http";

interface BiorxivPaper {
  authors: string;
  category: string;
  date: string;
  doi: string;
  title: string;
}

interface BiorxivPage {
  collection: BiorxivPaper[];
  messages: { total?: number | string }[];
}

// The API returns pages of 30, oldest first.
const PAGE_SIZE = 30;

const toDay = (date: Date) => date.toISOString().slice(0, 10);

async function fetchCategory(
  category: string,
  window: CurationWindow,
  limit: number,
  signal: AbortSignal
): Promise<BiorxivPaper[]> {
  const base = `https://api.biorxiv.org/details/biorxiv/${toDay(window.start)}/${toDay(window.end)}`;
  const query = `?category=${encodeURIComponent(category)}`;

  const first = await fetchJson<BiorxivPage>(`${base}/0${query}`, signal);
  const total = Number(first.messages[0]?.total ?? 0);
  if (total <= PAGE_SIZE) {
    return first.collection;
  }

  // Walk back from the last page to get the newest papers.
  const papers: BiorxivPaper[] = [];
  let cursor = Math.floor((total - 1) / PAGE_SIZE) * PAGE_SIZE;
  while (cursor > 0 && papers.length < limit) {
    const page = await fetchJson<BiorxivPage>(
      `${base}/${cursor}${query}`,
      signal
    );
    papers.push(...page.collection);
    cursor -= PAGE_SIZE;
  }
  if (papers.length < limit) {
    papers.push(...first.collection);
  }

  return papers;
}

export async function fetchBiorxiv(
  config: Extract<SourceConfig, { kind: "biorxiv" }>,
  window: CurationWindow,
  signal: AbortSignal
): Promise<SourceItem[]> {
  const byCategory = await Promise.all(
    config.categories.map((category) =>
      fetchCategory(category, window, config.maxCandidates, signal)
    )
  );

  return byCategory
    .flat()
    .map((paper) => ({
      // Without the version suffix, so new versions of a paper dedupe.
      url: `https://www.biorxiv.org/content/${paper.doi}`,
      title: paper.title,
      // Midday UTC so the date reads the same in any timezone we use.
      publishedAt: new Date(`${paper.date}T12:00:00Z`),
      signal: null,
      metadata: { authors: paper.authors, category: paper.category },
    }))
    .sort(byDateDesc);
}
