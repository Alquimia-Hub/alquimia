import { z } from "zod";
import { CATEGORY_IDS, MAX_CATEGORIES_PER_PROJECT } from "./categories";
import { PROJECT_LIMITS, PROJECT_SORTS } from "./constants";
import { isAllowedLogoUrl } from "./logo-url";

const HTTP_PROTOCOL = /^https?$/;

const HAS_PROTOCOL = /^[a-z][\w+.-]*:/i;

export function normalizeUrlInput(value: string): string {
  const trimmed = value.trim();

  if (trimmed === "" || HAS_PROTOCOL.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const isHttpUrl = (value: string) =>
  z.url({ protocol: HTTP_PROTOCOL }).safeParse(value).success;

const optionalUrl = z
  .string()
  .transform(normalizeUrlInput)
  .refine((value) => value === "" || isHttpUrl(value), {
    message: "urlInvalid",
  });

const logoUrl = z
  .string()
  .trim()
  .min(1, "logoRequired")
  .refine(isAllowedLogoUrl, { message: "logoNotUploaded" });

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
  websiteUrl: z
    .string()
    .transform(normalizeUrlInput)
    .refine(isHttpUrl, { message: "websiteRequired" }),
  xUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  discordUrl: optionalUrl,
  categoryIds: z
    .array(z.enum(CATEGORY_IDS))
    .transform((ids) => [...new Set(ids)])
    .refine((ids) => ids.length >= 1, { message: "categoriesRequired" })
    .refine((ids) => ids.length <= MAX_CATEGORIES_PER_PROJECT, {
      message: "categoriesTooMany",
    }),
});

export type ProjectFormValues = z.output<typeof projectFormSchema>;
export type ProjectFormInput = z.input<typeof projectFormSchema>;

export const OPTIONAL_LINK_FIELDS = [
  "xUrl",
  "githubUrl",
  "linkedinUrl",
  "instagramUrl",
  "tiktokUrl",
  "discordUrl",
] as const;

export const REVIEWABLE_FIELDS = [
  "name",
  "tagline",
  "description",
  "logoUrl",
  "websiteUrl",
  ...OPTIONAL_LINK_FIELDS,
] as const;

export function normalizeOptionalLinks(values: ProjectFormValues) {
  const links: Record<string, string | null> = {};

  for (const field of OPTIONAL_LINK_FIELDS) {
    links[field] = values[field] || null;
  }

  return links as Record<(typeof OPTIONAL_LINK_FIELDS)[number], string | null>;
}

export const projectFiltersSchema = z.object({
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .catch(undefined)
    .transform((value) => value || undefined),
  category: z.enum(CATEGORY_IDS).optional().catch(undefined),
  sort: z.enum(PROJECT_SORTS).default("votes").catch("votes"),
  page: z.coerce.number().int().min(1).max(1000).default(1).catch(1),
});

export type ProjectFilters = z.infer<typeof projectFiltersSchema>;

export const rejectProjectSchema = z.object({
  projectIds: z.array(z.string().min(1)).min(1).max(100),
  reason: z.string().trim().min(5).max(PROJECT_LIMITS.rejectionReason),
});

export const approveProjectsSchema = z.object({
  projectIds: z.array(z.string().min(1)).min(1).max(100),
});

export const reportProjectSchema = z.object({
  projectId: z.string().min(1),
  reason: z.string().trim().min(10).max(PROJECT_LIMITS.reportReason),
});

export const adminFiltersSchema = z.object({
  tab: z
    .enum(["pending", "approved", "rejected"])
    .default("pending")
    .catch("pending"),
  page: z.coerce.number().int().min(1).max(1000).default(1).catch(1),
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .catch(undefined)
    .transform((value) => value || undefined),
  reports: z
    .union([z.literal("1"), z.literal("0")])
    .optional()
    .catch(undefined)
    .transform((value) => value === "1"),
  votes: z
    .union([z.literal("1"), z.literal("0")])
    .optional()
    .catch(undefined)
    .transform((value) => value === "1"),
});

export type AdminFilters = z.infer<typeof adminFiltersSchema>;
