import type { CurationConfig, SourceConfig } from "./config";
import { fetchSource } from "./sources";
import { byDateDesc } from "./sources/http";
import type {
  Candidate,
  CurationResult,
  CurationWindow,
  SourceError,
  SourceItem,
} from "./types";
import { normalizeUrl } from "./url";

interface CurateInput {
  config: CurationConfig;
  /** Normalized URLs that were in the top of a previous run. */
  previousTopUrls: ReadonlySet<string>;
  window: CurationWindow;
}

// Sources with a signal rank by it, the rest by recency.
function compareItems(a: SourceItem, b: SourceItem): number {
  if (a.signal !== null && b.signal !== null && a.signal !== b.signal) {
    return b.signal - a.signal;
  }
  return byDateDesc(a, b);
}

function toCandidates(
  source: SourceConfig,
  items: SourceItem[],
  seen: Set<string>
): Candidate[] {
  const candidates: Candidate[] = [];

  for (const item of [...items].sort(compareItems)) {
    if (candidates.length >= source.maxCandidates) {
      break;
    }

    let url: string;
    try {
      url = normalizeUrl(item.url);
    } catch {
      continue;
    }

    if (
      seen.has(url) ||
      !item.title ||
      Number.isNaN(item.publishedAt.getTime())
    ) {
      continue;
    }
    seen.add(url);
    candidates.push({ ...item, url, source: source.id, topPosition: null });
  }

  return candidates;
}

/** Round-robin over sources in priority order, honoring each quota. */
function assignTop(
  sources: SourceConfig[],
  bySource: Candidate[][],
  topSize: number
): void {
  const taken = bySource.map(() => 0);
  let position = 1;
  let progressed = true;

  while (position <= topSize && progressed) {
    progressed = false;
    for (let index = 0; index < bySource.length; index++) {
      const next = bySource[index][taken[index]];
      if (position > topSize || !next || taken[index] >= sources[index].quota) {
        continue;
      }
      next.topPosition = position;
      position++;
      taken[index]++;
      progressed = true;
    }
  }
}

export async function curate({
  config,
  previousTopUrls,
  window,
}: CurateInput): Promise<CurationResult> {
  const sources = config.sources.filter((source) => source.enabled);
  const errors: SourceError[] = [];
  const results = await Promise.allSettled(
    sources.map((source) =>
      fetchSource(
        source,
        window,
        AbortSignal.timeout(config.sourceTimeoutMs),
        (message) => errors.push({ source: source.id, message })
      )
    )
  );

  const seen = new Set(previousTopUrls);
  const bySource = results.map((result, index) => {
    if (result.status === "rejected") {
      errors.push({
        source: sources[index].id,
        message:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
      return [];
    }
    return toCandidates(sources[index], result.value, seen);
  });

  assignTop(sources, bySource, config.topSize);

  return {
    window,
    errors,
    candidates: bySource.flat(),
    status:
      sources.length > 0 &&
      results.every((result) => result.status === "rejected")
        ? "failed"
        : "completed",
  };
}
