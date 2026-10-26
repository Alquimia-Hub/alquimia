import type { SourceConfig } from "../config";
import type { CurationWindow, SourceItem } from "../types";
import { fetchXml, inWindow, text } from "./http";

interface ArxivEntry {
  "arxiv:primary_category"?: { "@_term": string };
  author?: { name: unknown }[];
  id: unknown;
  published: unknown;
  title: unknown;
}

export async function fetchArxiv(
  config: Extract<SourceConfig, { kind: "arxiv" }>,
  window: CurationWindow,
  signal: AbortSignal
): Promise<SourceItem[]> {
  const params = new URLSearchParams({
    search_query: config.categories
      .map((category) => `cat:${category}`)
      .join(" OR "),
    sortBy: "submittedDate",
    sortOrder: "descending",
    max_results: String(config.maxCandidates),
  });

  const data = await fetchXml<{ feed?: { entry?: ArxivEntry[] } }>(
    `https://export.arxiv.org/api/query?${params}`,
    signal
  );

  return (data.feed?.entry ?? [])
    .map((entry) => ({
      url: text(entry.id),
      title: text(entry.title),
      publishedAt: new Date(text(entry.published)),
      signal: null,
      metadata: {
        authors: (entry.author ?? []).map((author) => text(author.name)),
        category: entry["arxiv:primary_category"]?.["@_term"] ?? null,
      },
    }))
    .filter((item) => inWindow(item.publishedAt, window));
}
