import { z } from "zod";

const baseSource = {
  id: z.string().min(1),
  enabled: z.boolean(),
  // Max candidates this source can place in the top.
  quota: z.int().nonnegative(),
  // Max candidates stored per run, after filtering by window.
  maxCandidates: z.int().positive(),
};

const categories = z.array(z.string().min(1)).min(1);

const sourceConfigSchema = z.discriminatedUnion("kind", [
  z.object({
    ...baseSource,
    kind: z.literal("hn"),
    minPoints: z.int().nonnegative(),
  }),
  z.object({
    ...baseSource,
    kind: z.literal("github-stars"),
    user: z.string().min(1),
  }),
  z.object({ ...baseSource, kind: z.literal("arxiv"), categories }),
  z.object({ ...baseSource, kind: z.literal("biorxiv"), categories }),
  z.object({
    ...baseSource,
    kind: z.literal("rss"),
    feeds: z.array(z.url()).min(1),
  }),
]);

const curationConfigSchema = z
  .object({
    defaultWindowDays: z.int().positive(),
    topSize: z.int().positive(),
    sourceTimeoutMs: z.int().positive(),
    // Ordered by priority: breaks URL ties and sets the round-robin order.
    sources: z.array(sourceConfigSchema).min(1),
  })
  .refine(
    (config) =>
      new Set(config.sources.map((source) => source.id)).size ===
      config.sources.length,
    { message: "Source ids must be unique", path: ["sources"] }
  );

export type SourceConfig = z.infer<typeof sourceConfigSchema>;
export type CurationConfig = z.infer<typeof curationConfigSchema>;

const rawConfig: z.input<typeof curationConfigSchema> = {
  defaultWindowDays: 7,
  topSize: 10,
  sourceTimeoutMs: 15_000,
  sources: [
    {
      id: "hn",
      kind: "hn",
      enabled: true,
      quota: 4,
      maxCandidates: 30,
      minPoints: 50,
    },
    {
      id: "github",
      kind: "github-stars",
      enabled: true,
      quota: 4,
      maxCandidates: 30,
      user: "alquimia-hq",
    },
    {
      id: "newsletters",
      kind: "rss",
      enabled: true,
      quota: 3,
      maxCandidates: 30,
      feeds: [
        "https://www.latent.space/feed",
        "https://importai.substack.com/feed",
        "https://www.oneusefulthing.org/feed",
        "https://www.interconnects.ai/feed",
      ],
    },
    {
      id: "arxiv",
      kind: "arxiv",
      enabled: true,
      quota: 2,
      maxCandidates: 30,
      categories: ["cs.AI", "cs.LG", "cs.CL", "cs.CR", "cs.HC"],
    },
    {
      id: "biorxiv",
      kind: "biorxiv",
      enabled: true,
      quota: 2,
      maxCandidates: 30,
      categories: ["bioinformatics", "synthetic biology", "genomics"],
    },
  ],
};

export const CURATION_CONFIG: CurationConfig =
  curationConfigSchema.parse(rawConfig);
