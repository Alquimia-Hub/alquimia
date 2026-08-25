import { z } from "zod";
import { CATEGORY_IDS, MAX_CATEGORIES_PER_PROJECT } from "./categories";
import { PROJECT_LIMITS, PROJECT_SORTS } from "./constants";

const HTTP_PROTOCOL = /^https?$/;

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      z.url({ protocol: HTTP_PROTOCOL }).safeParse(value).success,
    { message: "urlInvalid" }
  );

const logoUrl = z
  .string()
  .trim()
  .min(1, "logoRequired")
  .refine(
    (value) =>
      value.startsWith("/") ||
      z.url({ protocol: HTTP_PROTOCOL }).safeParse(value).success,
    { message: "logoRequired" }
  );

export const projectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "nameTooShort")
    .max(PROJECT_LIMITS.name, "nameTooLong"),
  tagline: z
    .string()
    .trim()
    .min(10, "taglineTooShort")
    .max(PROJECT_LIMITS.tagline, "taglineTooLong"),
  description: z
    .string()
    .trim()
    .min(40, "descriptionTooShort")
    .max(PROJECT_LIMITS.description, "descriptionTooLong"),
  logoUrl,
  websiteUrl: z.url({ protocol: HTTP_PROTOCOL, error: "websiteRequired" }),
  xUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  discordUrl: optionalUrl,
  categoryIds: z
    .array(z.enum(CATEGORY_IDS))
    .min(1, "categoriesRequired")
    .max(MAX_CATEGORIES_PER_PROJECT, "categoriesTooMany"),
});

export type ProjectFormValues = z.output<typeof projectFormSchema>;

export const OPTIONAL_LINK_FIELDS = [
  "xUrl",
  "githubUrl",
  "linkedinUrl",
  "instagramUrl",
  "tiktokUrl",
  "discordUrl",
] as const;

export function normalizeOptionalLinks(values: ProjectFormValues) {
  const links: Record<string, string | null> = {};

  for (const field of OPTIONAL_LINK_FIELDS) {
    links[field] = values[field] || null;
  }

  return links as Record<(typeof OPTIONAL_LINK_FIELDS)[number], string | null>;
}

export const projectFiltersSchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: z.enum(CATEGORY_IDS).optional(),
  sort: z.enum(PROJECT_SORTS).default("votes"),
  page: z.coerce.number().int().min(1).default(1),
});

export type ProjectFilters = z.infer<typeof projectFiltersSchema>;

export const rejectProjectSchema = z.object({
  projectIds: z.array(z.string()).min(1),
  reason: z.string().trim().min(5).max(PROJECT_LIMITS.rejectionReason),
});

export const approveProjectsSchema = z.object({
  projectIds: z.array(z.string()).min(1),
});

export const reportProjectSchema = z.object({
  projectId: z.string(),
  reason: z.string().trim().min(10).max(PROJECT_LIMITS.reportReason),
});
