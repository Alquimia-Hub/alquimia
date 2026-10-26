import type { SourceConfig } from "../config";
import type { CurationWindow, SourceItem } from "../types";
import { fetchXml, inWindow, text } from "./http";

interface RssItem {
  link?: unknown[];
  pubDate?: unknown;
  title?: unknown;
}

interface AtomEntry {
  link?: { "@_href"?: string; "@_rel"?: string }[];
  published?: unknown;
  title?: unknown;
  updated?: unknown;
}

interface Feed {
  feed?: { entry?: AtomEntry[]; title?: unknown };
  rss?: { channel?: { item?: RssItem[]; title?: unknown } };
}

function parseFeed(data: Feed, feedUrl: string): SourceItem[] {
  const channel = data.rss?.channel;
  if (channel) {
    const feedTitle = text(channel.title);
    return (channel.item ?? []).map((item) => ({
      url: text(item.link?.[0]),
      title: text(item.title),
      publishedAt: new Date(text(item.pubDate)),
      signal: null,
      metadata: { feed: feedTitle, feedUrl },
    }));
  }

  const feed = data.feed;
  if (feed) {
    const feedTitle = text(feed.title);
    return (feed.entry ?? []).map((entry) => {
      const link =
        entry.link?.find((candidate) => candidate["@_rel"] !== "self") ??
        entry.link?.[0];
      return {
        url: link?.["@_href"] ?? "",
        title: text(entry.title),
        publishedAt: new Date(text(entry.published ?? entry.updated)),
        signal: null,
        metadata: { feed: feedTitle, feedUrl },
      };
    });
  }

  throw new Error(`Unrecognized feed format (${feedUrl})`);
}

export async function fetchRss(
  config: Extract<SourceConfig, { kind: "rss" }>,
  window: CurationWindow,
  signal: AbortSignal
): Promise<SourceItem[]> {
  const feeds = await Promise.allSettled(
    config.feeds.map(async (feedUrl) =>
      parseFeed(await fetchXml<Feed>(feedUrl, signal), feedUrl)
    )
  );

  const failed = feeds.flatMap((feed) =>
    feed.status === "rejected" ? [String(feed.reason)] : []
  );
  if (failed.length === feeds.length) {
    throw new Error(failed.join("; "));
  }

  return feeds
    .flatMap((feed) => (feed.status === "fulfilled" ? feed.value : []))
    .filter((item) => item.url && inWindow(item.publishedAt, window));
}
