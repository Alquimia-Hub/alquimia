export const MAX_PROJECTS_PER_USER = 5;

export const VOTE_WEIGHT_DEFAULT = 1;
export const VOTE_WEIGHT_ALQUIMISTA = 3;

export const ALQUIMISTA_CHECK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const LOGO_SIZE_PX = 256;
export const LOGO_MAX_BYTES = 1024 * 1024;

export const PROJECTS_PER_PAGE = 24;

export const ADMIN_PROJECTS_PER_PAGE = 25;

export const ADMIN_VOTES_PER_PAGE = 50;

export const LANDING_TOP_PROJECTS = 3;

export const PROJECT_LIMITS = {
  name: 60,
  tagline: 120,
  description: 4000,
  rejectionReason: 500,
  reportReason: 500,
} as const;

export const PROJECT_SORTS = ["votes", "recent"] as const;
export type ProjectSort = (typeof PROJECT_SORTS)[number];

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const RATE_LIMITS = {
  createProject: { limit: 3, windowMs: HOUR_MS },
  updateProject: { limit: 20, windowMs: HOUR_MS },
  deleteProject: { limit: 10, windowMs: DAY_MS },
  vote: [
    { limit: 20, windowMs: MINUTE_MS },
    { limit: 150, windowMs: HOUR_MS },
  ],
  report: { limit: 5, windowMs: DAY_MS },
  uploadLogo: { limit: 20, windowMs: HOUR_MS },
  badgeRefresh: { limit: 5, windowMs: HOUR_MS },
} as const;
