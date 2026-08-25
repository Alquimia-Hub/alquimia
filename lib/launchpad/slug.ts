const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const EDGE_DASHES = /^-+|-+$/g;
const DIACRITICS = /[̀-ͯ]/g;

const MAX_SLUG_LENGTH = 60;

export const RESERVED_SLUGS = new Set([
  "new",
  "my-projects",
  "edit",
  "admin",
  "account",
  "api",
]);

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(NON_ALPHANUMERIC, "-")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(EDGE_DASHES, "");
}

export const isReservedSlug = (slug: string) => RESERVED_SLUGS.has(slug);
