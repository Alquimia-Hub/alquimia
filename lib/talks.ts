export interface Talk {
  date: string;
  description: string;
  event: string;
  id: string;
  speakers: string;
  /** Second the talk starts at, for videos embedded inside a longer stream. */
  startSeconds?: number;
  title: string;
  youtubeId: string;
}

export const TALKS: readonly Talk[] = [
  {
    id: "agentes-ia-opbnb",
    youtubeId: "zt5cvUjv-DM",
    title: "Agentes de IA sobre opBNB para Fintechs",
    event: "X Space · BNB Chain × Alquimia",
    date: "Mayo 2026",
    speakers: "Brian Sasbon · Emmanuel Martínez",
    description:
      "Cómo construir agentes autónomos que ejecutan on-chain: casos de uso reales, automatización y una demo en vivo.",
    startSeconds: 1690,
  },
];

const THUMBNAIL_BASE = "https://i.ytimg.com/vi";

export function talkThumbnailUrl(youtubeId: string): string {
  return `${THUMBNAIL_BASE}/${youtubeId}/maxresdefault.jpg`;
}

export function talkEmbedUrl(talk: Talk): string {
  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  if (talk.startSeconds) {
    params.set("start", String(talk.startSeconds));
  }
  return `https://www.youtube-nocookie.com/embed/${talk.youtubeId}?${params}`;
}

export function talkWatchUrl(talk: Talk): string {
  const suffix = talk.startSeconds ? `&t=${talk.startSeconds}s` : "";
  return `https://www.youtube.com/watch?v=${talk.youtubeId}${suffix}`;
}
