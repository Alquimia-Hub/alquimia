import "server-only";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/lib/db";
import type { ProjectStatus } from "@/lib/db/schema";
import { project, projectCategory, report, user, vote } from "@/lib/db/schema";
import {
  ADMIN_PROJECTS_PER_PAGE,
  ADMIN_VOTES_PER_PAGE,
  LANDING_TOP_PROJECTS,
  PROJECTS_PER_PAGE,
} from "./constants";
import type { ProjectFilters } from "./validation";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

const publicColumns = {
  id: project.id,
  slug: project.slug,
  name: project.name,
  tagline: project.tagline,
  logoUrl: project.logoUrl,
  voteScore: project.voteScore,
  createdAt: project.createdAt,
};

async function categoriesByProject(projectIds: string[]) {
  if (projectIds.length === 0) {
    return new Map<string, string[]>();
  }

  const rows = await db
    .select({
      projectId: projectCategory.projectId,
      categoryId: projectCategory.categoryId,
    })
    .from(projectCategory)
    .where(inArray(projectCategory.projectId, projectIds));

  const grouped = new Map<string, string[]>();
  for (const row of rows) {
    const current = grouped.get(row.projectId) ?? [];
    current.push(row.categoryId);
    grouped.set(row.projectId, current);
  }

  return grouped;
}

export interface ProjectListItem {
  categoryIds: string[];
  createdAt: Date;
  id: string;
  logoUrl: string;
  name: string;
  slug: string;
  tagline: string;
  voteScore: number;
}

const TSQUERY_SEPARATOR = /\s+/;
const TSQUERY_UNSAFE = /[^\p{L}\p{N}]+/gu;

function prefixTsQuery(input: string) {
  const terms = input
    .split(TSQUERY_SEPARATOR)
    .map((term) => term.replace(TSQUERY_UNSAFE, ""))
    .filter(Boolean);

  return terms.length > 0 ? terms.map((term) => `${term}:*`).join(" & ") : null;
}

export async function listApprovedProjects(filters: ProjectFilters) {
  const conditions = [eq(project.status, "approved")];

  if (filters.q) {
    const tsQuery = prefixTsQuery(filters.q);

    const byName = ilike(project.name, `%${filters.q}%`);

    conditions.push(
      tsQuery
        ? (or(
            sql`${project.searchVector} @@ to_tsquery('simple', ${tsQuery})`,
            byName
          ) ?? byName)
        : byName
    );
  }

  if (filters.category) {
    conditions.push(
      sql`exists (
        select 1 from ${projectCategory}
        where ${projectCategory.projectId} = ${project.id}
          and ${projectCategory.categoryId} = ${filters.category}
      )`
    );
  }

  const where = and(...conditions);
  const orderBy =
    filters.sort === "recent"
      ? [desc(project.createdAt)]
      : [desc(project.voteScore), desc(project.createdAt)];

  const [rows, [totals]] = await Promise.all([
    db
      .select(publicColumns)
      .from(project)
      .where(where)
      .orderBy(...orderBy)
      .limit(PROJECTS_PER_PAGE)
      .offset((filters.page - 1) * PROJECTS_PER_PAGE),
    db.select({ total: count() }).from(project).where(where),
  ]);

  const categories = await categoriesByProject(rows.map((row) => row.id));

  const items: ProjectListItem[] = rows.map((row) => ({
    ...row,
    categoryIds: categories.get(row.id) ?? [],
  }));

  const total = totals?.total ?? 0;

  return {
    items,
    total,
    pageCount: Math.max(1, Math.ceil(total / PROJECTS_PER_PAGE)),
  };
}

export async function getTopProjects() {
  return await db
    .select(publicColumns)
    .from(project)
    .where(eq(project.status, "approved"))
    .orderBy(desc(project.voteScore), desc(project.createdAt))
    .limit(LANDING_TOP_PROJECTS);
}

export async function getProjectBySlug(slug: string) {
  const [row] = await db
    .select({
      project,
      owner: {
        id: user.id,
        name: user.name,
        image: user.image,
        hideAvatar: user.hideAvatar,
        isAlquimista: user.isAlquimista,
      },
    })
    .from(project)
    .innerJoin(user, eq(project.ownerId, user.id))
    .where(eq(project.slug, slug))
    .limit(1);

  if (!row) {
    return null;
  }

  const categories = await categoriesByProject([row.project.id]);

  return {
    ...row.project,
    owner: row.owner,
    categoryIds: categories.get(row.project.id) ?? [],
  };
}

export type ProjectDetail = NonNullable<
  Awaited<ReturnType<typeof getProjectBySlug>>
>;

export async function hasUserVoted(projectId: string, userId: string) {
  const [row] = await db
    .select({ projectId: vote.projectId })
    .from(vote)
    .where(and(eq(vote.projectId, projectId), eq(vote.userId, userId)))
    .limit(1);

  return Boolean(row);
}

export async function listUserProjects(userId: string) {
  const rows = await db
    .select({
      ...publicColumns,
      status: project.status,
      rejectionReason: project.rejectionReason,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .where(eq(project.ownerId, userId))
    .orderBy(desc(project.updatedAt));

  const categories = await categoriesByProject(rows.map((row) => row.id));

  return rows.map((row) => ({
    ...row,
    categoryIds: categories.get(row.id) ?? [],
  }));
}

export type UserProject = Awaited<ReturnType<typeof listUserProjects>>[number];

export async function countUserProjects(userId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(project)
    .where(eq(project.ownerId, userId));

  return row?.total ?? 0;
}

export async function listProjectsForAdmin(
  status: ProjectStatus,
  page = 1,
  search?: string
) {
  const conditions = [eq(project.status, status)];

  if (search) {
    const needle = `%${search}%`;

    const byName = ilike(project.name, needle);

    conditions.push(
      or(byName, ilike(user.name, needle), ilike(user.email, needle)) ?? byName
    );
  }

  const where = and(...conditions);
  const offset = (page - 1) * ADMIN_PROJECTS_PER_PAGE;

  const [rows, [totals]] = await Promise.all([
    db
      .select({
        id: project.id,
        slug: project.slug,
        name: project.name,
        tagline: project.tagline,
        description: project.description,
        logoUrl: project.logoUrl,
        websiteUrl: project.websiteUrl,
        xUrl: project.xUrl,
        githubUrl: project.githubUrl,
        linkedinUrl: project.linkedinUrl,
        instagramUrl: project.instagramUrl,
        tiktokUrl: project.tiktokUrl,
        discordUrl: project.discordUrl,
        status: project.status,
        rejectionReason: project.rejectionReason,
        voteScore: project.voteScore,
        createdAt: project.createdAt,
        submittedAt: project.submittedAt,
        reviewedAt: project.reviewedAt,
        reviewedByName: sql<
          string | null
        >`(select r.name from ${user} r where r.id = ${project.reviewedById})`,
        ownerName: user.name,
        ownerEmail: user.email,
        ownerImage: user.image,
        ownerIsAlquimista: user.isAlquimista,
      })
      .from(project)
      .innerJoin(user, eq(project.ownerId, user.id))
      .where(where)
      .orderBy(desc(project.submittedAt), desc(project.createdAt))
      .limit(ADMIN_PROJECTS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(project)
      .innerJoin(user, eq(project.ownerId, user.id))
      .where(where),
  ]);

  const categories = await categoriesByProject(rows.map((row) => row.id));

  const total = totals?.total ?? 0;

  return {
    items: rows.map((row) => ({
      ...row,
      categoryIds: categories.get(row.id) ?? [],
    })),
    total,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PROJECTS_PER_PAGE)),
  };
}

export type AdminProject = Awaited<
  ReturnType<typeof listProjectsForAdmin>
>["items"][number];

export async function countProjectsByStatus() {
  const rows = await db
    .select({ status: project.status, total: count() })
    .from(project)
    .groupBy(project.status);

  const byStatus = new Map(rows.map((row) => [row.status, row.total]));

  return {
    pending: byStatus.get("pending") ?? 0,
    approved: byStatus.get("approved") ?? 0,
    rejected: byStatus.get("rejected") ?? 0,
  };
}

export async function listOpenReports() {
  return await db
    .select({
      id: report.id,
      reason: report.reason,
      createdAt: report.createdAt,
      projectId: project.id,
      projectName: project.name,
      projectSlug: project.slug,
      projectStatus: project.status,
      reporterName: user.name,
      reporterEmail: user.email,
    })
    .from(report)
    .innerJoin(project, eq(report.projectId, project.id))
    .innerJoin(user, eq(report.reporterId, user.id))
    .where(eq(report.status, "open"))
    .orderBy(desc(report.createdAt));
}

export type AdminReport = Awaited<ReturnType<typeof listOpenReports>>[number];

export async function listVotesForAdmin(page: number) {
  const offset = (page - 1) * ADMIN_VOTES_PER_PAGE;

  const [items, [totals]] = await Promise.all([
    db
      .select({
        createdAt: vote.createdAt,
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
        voterEmail: user.email,
        voterHideAvatar: user.hideAvatar,
        voterId: user.id,
        voterImage: user.image,
        voterIsAlquimista: user.isAlquimista,
        voterName: user.name,
      })
      .from(vote)
      .innerJoin(project, eq(vote.projectId, project.id))
      .innerJoin(user, eq(vote.userId, user.id))
      .orderBy(desc(vote.createdAt))
      .limit(ADMIN_VOTES_PER_PAGE)
      .offset(offset),
    db.select({ total: count() }).from(vote),
  ]);

  const total = totals?.total ?? 0;

  return {
    items,
    total,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_VOTES_PER_PAGE)),
  };
}

export type AdminVote = Awaited<
  ReturnType<typeof listVotesForAdmin>
>["items"][number];

export async function countVotesByPeriod() {
  const now = Date.now();
  const dayAgo = new Date(now - DAY_MS);
  const weekAgo = new Date(now - WEEK_MS);

  const [row] = await db
    .select({
      total: count(),
      lastDay:
        sql<number>`count(*) filter (where ${gte(vote.createdAt, dayAgo)})`.mapWith(
          Number
        ),
      lastWeek:
        sql<number>`count(*) filter (where ${gte(vote.createdAt, weekAgo)})`.mapWith(
          Number
        ),
    })
    .from(vote);

  return {
    total: row?.total ?? 0,
    lastDay: row?.lastDay ?? 0,
    lastWeek: row?.lastWeek ?? 0,
  };
}

export async function countPendingProjects() {
  const [row] = await db
    .select({ total: count() })
    .from(project)
    .where(eq(project.status, "pending"));

  return row?.total ?? 0;
}
