export const CATEGORIES = [
  { id: "negocios", icon: "Briefcase", color: "amber" },
  { id: "comunidad-social", icon: "Users", color: "rose" },
  { id: "tecnologia-ia", icon: "Bot", color: "sky" },
  { id: "productividad", icon: "CalendarCheck", color: "violet" },
  { id: "marketing-comercio", icon: "Megaphone", color: "blue" },
  { id: "finanzas", icon: "TrendingUp", color: "emerald" },
  { id: "entretenimiento-lifestyle", icon: "Gamepad2", color: "indigo" },
  { id: "salud-bienestar", icon: "HeartPulse", color: "pink" },
  { id: "educacion", icon: "BookOpen", color: "orange" },
  { id: "diseno", icon: "Palette", color: "fuchsia" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [
  CategoryId,
  ...CategoryId[],
];

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export const getCategory = (id: string) => CATEGORY_BY_ID.get(id as CategoryId);

export const MAX_CATEGORIES_PER_PROJECT = 3;
