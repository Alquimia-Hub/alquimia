import type { SourceConfig } from "../config";
import type { CurationWindow, SourceItem } from "../types";
import { fetchJson } from "./http";

interface AlgoliaHit {
  author: string;
  created_at_i: number;
  num_comments: number | null;
  objectID: string;
  points: number | null;
  title: string;
  url: string | null;
}

const HITS_PER_PAGE = 100;

export async function fetchHackerNews(
  config: Extract<SourceConfig, { kind: "hn" }>,
  window: CurationWindow,
  signal: AbortSignal
): Promise<SourceItem[]> {
  const start = Math.floor(window.start.getTime() / 1000);
  const end = Math.floor(window.end.getTime() / 1000);
  const params = new URLSearchParams({
    tags: "story",
    numericFilters: `created_at_i>=${start},created_at_i<=${end},points>=${config.minPoints}`,
    hitsPerPage: String(Math.max(HITS_PER_PAGE, config.maxCandidates)),
  });

  const { hits } = await fetchJson<{ hits: AlgoliaHit[] }>(
    `https://hn.algolia.com/api/v1/search?${params}`,
    signal
  );

  return hits.map((hit) => {
    const hnUrl = `https://news.ycombinator.com/item?id=${hit.objectID}`;
    return {
      url: hit.url || hnUrl,
      title: hit.title,
      publishedAt: new Date(hit.created_at_i * 1000),
      signal: hit.points ?? 0,
      metadata: {
        hnUrl,
        comments: hit.num_comments ?? 0,
        author: hit.author,
      },
    };
  });
}
