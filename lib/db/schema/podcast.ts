import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const podcastCurationStatus = pgEnum("podcast_curation_status", [
  "running",
  "completed",
  "failed",
]);

export const podcastCurationRun = pgTable(
  "podcast_curation_run",
  {
    id: text("id").primaryKey(),
    status: podcastCurationStatus("status").default("running").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    windowEnd: timestamp("window_end", { withTimezone: true }).notNull(),
    triggeredById: text("triggered_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    sourceErrors: jsonb("source_errors")
      .$type<{ message: string; source: string }[]>()
      .default([])
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => [
    index("podcast_curation_run_status_idx").on(
      table.status,
      table.windowEnd.desc()
    ),
  ]
);

export const podcastCandidate = pgTable(
  "podcast_candidate",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => podcastCurationRun.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    signal: integer("signal"),
    topPosition: integer("top_position"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
  },
  (table) => [
    uniqueIndex("podcast_candidate_run_url_idx").on(table.runId, table.url),
    index("podcast_candidate_url_idx").on(table.url),
  ]
);

export const podcastCurationRunRelations = relations(
  podcastCurationRun,
  ({ many, one }) => ({
    candidates: many(podcastCandidate),
    triggeredBy: one(user, {
      fields: [podcastCurationRun.triggeredById],
      references: [user.id],
    }),
  })
);

export const podcastCandidateRelations = relations(
  podcastCandidate,
  ({ one }) => ({
    run: one(podcastCurationRun, {
      fields: [podcastCandidate.runId],
      references: [podcastCurationRun.id],
    }),
  })
);
