import type { SourceConfig } from "../config";
import type { CurationWindow, SourceItem } from "../types";
import { fetchArxiv } from "./arxiv";
import { fetchBiorxiv } from "./biorxiv";
import { fetchGithubStars } from "./github-stars";
import { fetchHackerNews } from "./hn";
import { fetchRss } from "./rss";

export function fetchSource(
  config: SourceConfig,
  window: CurationWindow,
  signal: AbortSignal,
  reportError: (message: string) => void
): Promise<SourceItem[]> {
  switch (config.kind) {
    case "hn":
      return fetchHackerNews(config, window, signal);
    case "github-stars":
      return fetchGithubStars(config, window, signal);
    case "arxiv":
      return fetchArxiv(config, window, signal);
    case "biorxiv":
      return fetchBiorxiv(config, window, signal);
    case "rss":
      return fetchRss(config, window, signal, reportError);
    default:
      throw new Error(`Unknown source kind: ${(config as SourceConfig).kind}`);
  }
}
