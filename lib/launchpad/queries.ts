import "server-only";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { project, projectCategory, report, user, vote } from "@/lib/db/schema";
import { LANDING_TOP_PROJECTS, PROJECTS_PER_PAGE } from "./constants";
import type { ProjectFilters } from "./validation";

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

export async function listApprovedProjects(filters: ProjectFilters) {
  const conditions = [eq(project.status, "approved")];

  if (filters.q) {
    conditions.push(
      sql`${project.searchVector} @@ plainto_tsquery('spanish', ${filters.q})`
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

  return {
    items,
    total: totals?.total ?? 0,
    pageCount: Math.max(1, Math.ceil((totals?.total ?? 0) / PROJECTS_PER_PAGE)),
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

export async function countUserProjects(userId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(project)
    .where(eq(project.ownerId, userId));

  return row?.total ?? 0;
}

export async function listProjectsForAdmin(
  status?: "draft" | "pending" | "approved" | "rejected"
) {
  const rows = await db
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
      ownerName: user.name,
      ownerEmail: user.email,
      ownerImage: user.image,
      ownerIsAlquimista: user.isAlquimista,
    })
    .from(project)
    .innerJoin(user, eq(project.ownerId, user.id))
    .where(status ? eq(project.status, status) : undefined)
    .orderBy(desc(project.submittedAt), desc(project.createdAt));

  const categories = await categoriesByProject(rows.map((row) => row.id));

  return rows.map((row) => ({
    ...row,
    categoryIds: categories.get(row.id) ?? [],
  }));
}

export type AdminProject = Awaited<
  ReturnType<typeof listProjectsForAdmin>
>[number];

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

export async function countPendingProjects() {
  const [row] = await db
    .select({ total: count() })
    .from(project)
    .where(eq(project.status, "pending"));

  return row?.total ?? 0;
}
