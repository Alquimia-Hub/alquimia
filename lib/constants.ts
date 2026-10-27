export const SITE_URL = "https://alquimia.community";

export const GITHUB_ORG = "Alquimia-Hub";

export const CONTACT_EMAIL = "contact@alquimia.community";

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_ORG}`,
  x: "https://x.com/alquimia_hub",
  youtube: "https://www.youtube.com/@alquimia_hub",
} as const;

export const COMMUNITY_LINKS = {
  discord: "https://discord.gg/wkhHrWZC3Q",
  whatsapp: "https://chat.whatsapp.com/BhC5waw0nm1FIRSb9Kvs7a",
} as const;

/** Members across Discord and WhatsApp, shown in the hero. Update by hand. */
export const COMMUNITY_MEMBERS = 200;

export const PILLAR_IDS = [
  "inteligencia",
  "automatizacion",
  "productividad",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

// The manifesto only exists in Spanish; both locales link to it.
export const MANIFESTO_URL = `https://github.com/${GITHUB_ORG}/alquimia/blob/main/MANIFIESTO.md`;

// The four places of the site, in the header, the mobile menu and the footer.
export const SITE_SECTIONS = [
  { href: "/launchpad", key: "launchpad" },
  { href: "/#charlas", key: "talks" },
  { href: "/#laboratorio", key: "lab" },
  { href: "/#manifiesto", key: "manifesto" },
] as const;
