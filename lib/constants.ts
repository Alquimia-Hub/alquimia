export const SITE_URL = "https://alquimia.community";

export const GITHUB_ORG = "Alquimia-Hub";

export const CONTACT_EMAIL = "contact@alquimia.community";

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_ORG}`,
  x: "https://x.com/alquimia_hub",
} as const;

export const COMMUNITY_LINKS = {
  discord: "https://discord.gg/wkhHrWZC3Q",
  whatsapp: "https://chat.whatsapp.com/BhC5waw0nm1FIRSb9Kvs7a",
} as const;

export const PILLAR_IDS = [
  "inteligencia",
  "automatizacion",
  "productividad",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];
