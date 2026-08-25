import { relations, sql } from "drizzle-orm";
import {
  bigint,
  customType,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

const tsvector = customType<{ data: string; driverData: string }>({
  dataType: () => "tsvector",
});

export const projectStatus = pgEnum("project_status", [
  "pending",
  "approved",
  "rejected",
]);

export const voteAction = pgEnum("vote_action", ["added", "removed"]);

export const reportStatus = pgEnum("report_status", [
  "open",
  "dismissed",
  "actioned",
]);

export const category = pgTable("category", {
  id: text("id").primaryKey(),
  sortOrder: integer("sort_order").notNull(),
});

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    logoUrl: text("logo_url").notNull(),

    websiteUrl: text("website_url").notNull(),
    xUrl: text("x_url"),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),
    instagramUrl: text("instagram_url"),
    tiktokUrl: text("tiktok_url"),
    discordUrl: text("discord_url"),

    status: projectStatus("status").default("pending").notNull(),

    rejectionReason: text("rejection_reason"),

    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reviewedById: text("reviewed_by_id").references(() => user.id, {
      onDelete: "set null",
    }),

    voteScore: integer("vote_score").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(tagline, '') || ' ' || coalesce(description, ''))`
    ),
  },
  (table) => [
    index("project_status_idx").on(table.status),
    index("project_vote_score_idx").on(table.status, table.voteScore.desc()),
    index("project_created_at_idx").on(table.status, table.createdAt.desc()),
    index("project_owner_id_idx").on(table.ownerId),
    index("project_search_idx").using("gin", table.searchVector),
  ]
);

export const projectCategory = pgTable(
  "project_category",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.categoryId] }),
    index("project_category_category_id_idx").on(table.categoryId),
  ]
);

export const vote = pgTable(
  "vote",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.userId] }),
    index("vote_user_id_idx").on(table.userId),
  ]
);

export const voteEvent = pgTable(
  "vote_event",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    action: voteAction("action").notNull(),
    weight: integer("weight").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("vote_event_created_at_idx").on(table.createdAt.desc()),
    index("vote_event_project_id_idx").on(table.projectId),
  ]
);

export const report = pgTable(
  "report",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    status: reportStatus("status").default("open").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("report_status_idx").on(table.status),
    index("report_project_id_idx").on(table.projectId),
    uniqueIndex("report_open_unique_idx")
      .on(table.projectId, table.reporterId)
      .where(sql`${table.status} = 'open'`),
  ]
);

export const rateLimit = pgTable("rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").default(0).notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
});

export const projectRelations = relations(project, ({ one, many }) => ({
  owner: one(user, { fields: [project.ownerId], references: [user.id] }),
  reviewedBy: one(user, {
    fields: [project.reviewedById],
    references: [user.id],
  }),
  categories: many(projectCategory),
  votes: many(vote),
  reports: many(report),
}));

export const projectCategoryRelations = relations(
  projectCategory,
  ({ one }) => ({
    project: one(project, {
      fields: [projectCategory.projectId],
      references: [project.id],
    }),
    category: one(category, {
      fields: [projectCategory.categoryId],
      references: [category.id],
    }),
  })
);

export const categoryRelations = relations(category, ({ many }) => ({
  projects: many(projectCategory),
}));

export const voteRelations = relations(vote, ({ one }) => ({
  project: one(project, {
    fields: [vote.projectId],
    references: [project.id],
  }),
  user: one(user, { fields: [vote.userId], references: [user.id] }),
}));

export const voteEventRelations = relations(voteEvent, ({ one }) => ({
  project: one(project, {
    fields: [voteEvent.projectId],
    references: [project.id],
  }),
  user: one(user, { fields: [voteEvent.userId], references: [user.id] }),
}));

export const reportRelations = relations(report, ({ one }) => ({
  project: one(project, {
    fields: [report.projectId],
    references: [project.id],
  }),
  reporter: one(user, { fields: [report.reporterId], references: [user.id] }),
}));

export type Project = typeof project.$inferSelect;
export type ProjectStatus = Project["status"];
export type Category = typeof category.$inferSelect;
export type Report = typeof report.$inferSelect;
export type VoteEvent = typeof voteEvent.$inferSelect;
