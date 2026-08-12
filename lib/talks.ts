export interface Talk {
  date: string;
  description: string;
  event: string;
  id: string;
  speakers: string;
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
  },
];

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
