/**
 * Talks we've given, newest first. Only the stable identifiers live here — the
 * title, event, date, speakers and description are localized in
 * `messages/*.json` under `Talks.items.<id>`.
 */
export const TALKS = [
  { id: "agentes-ia-opbnb", youtubeId: "zt5cvUjv-DM" },
] as const;

export type Talk = (typeof TALKS)[number];
export type TalkId = Talk["id"];

const THUMBNAIL_BASE = "https://i.ytimg.com/vi";

export function talkThumbnailUrl(youtubeId: string): string {
  return `${THUMBNAIL_BASE}/${youtubeId}/maxresdefault.jpg`;
}

export function talkEmbedUrl(talk: Talk): string {
  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  return `https://www.youtube-nocookie.com/embed/${talk.youtubeId}?${params}`;
}

export function talkWatchUrl(talk: Talk): string {
  return `https://www.youtube.com/watch?v=${talk.youtubeId}`;
}
