export const GITHUB_ORG = "Alquimia-Hub";

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_ORG}`,
  x: "https://x.com/alquimia_hub",
} as const;

export const COMMUNITY_LINKS = {
  discord: "https://discord.gg/wkhHrWZC3Q",
  whatsapp: "https://chat.whatsapp.com/BhC5waw0nm1FIRSb9Kvs7a",
} as const;

/** Order of the pillars in the hero, matched to icons and message keys. */
export const PILLAR_IDS = [
  "inteligencia",
  "automatizacion",
  "productividad",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];
