"use server";

import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { project, projectCategory, report, user, vote } from "@/lib/db/schema";
import {
  sendAdminNewSubmissionEmail,
  sendProjectApprovedEmail,
  sendProjectRejectedEmail,
} from "@/lib/mail/send";
import {
  MAX_PROJECTS_PER_USER,
  VOTE_WEIGHT_ALQUIMISTA,
  VOTE_WEIGHT_DEFAULT,
} from "./constants";
import { refreshAlquimistaBadge } from "./discord";
import { requireAdmin, requireUser } from "./session";
import { slugify } from "./slug";
import {
  approveProjectsSchema,
  normalizeOptionalLinks,
  projectFormSchema,
  rejectProjectSchema,
  reportProjectSchema,
} from "./validation";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });
const fail = (error: string): ActionResult<never> => ({ ok: false, error });

function failValidation(error: z.ZodError, message: string) {
  if (process.env.NODE_ENV === "production") {
    return fail(message);
  }

  return fail(`${message} — ${z.prettifyError(error)}`);
}

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function invalidateLanding() {
  revalidatePath("/[locale]", "page");
}

const WEIGHT_CASE = sql.raw(
  `case when u.is_alquimista then ${VOTE_WEIGHT_ALQUIMISTA} else ${VOTE_WEIGHT_DEFAULT} end`
);

async function recalculateProjectScore(projectId: string) {
  await db.execute(sql`
    update ${project} set
      vote_score = coalesce((
        select sum(${WEIGHT_CASE})
        from ${vote} v join ${user} u on u.id = v.user_id
        where v.project_id = ${projectId}
      ), 0),
      vote_count = (select count(*) from ${vote} v where v.project_id = ${projectId})
    where ${project.id} = ${projectId}
  `);
}

async function recalculateScoresForVoter(userId: string) {
  await db.execute(sql`
    update ${project} p set
      vote_score = coalesce((
        select sum(${WEIGHT_CASE})
        from ${vote} v join ${user} u on u.id = v.user_id
        where v.project_id = p.id
      ), 0)
    where p.id in (select v.project_id from ${vote} v where v.user_id = ${userId})
  `);
}

const since = (windowMs: number) => new Date(Date.now() - windowMs);

async function uniqueSlug(name: string) {
  const base = slugify(name) || "proyecto";
  const [existing] = await db
    .select({ slug: project.slug })
    .from(project)
    .where(eq(project.slug, base))
    .limit(1);

  return existing ? `${base}-${nanoid(5).toLowerCase()}` : base;
}

async function replaceCategories(projectId: string, categoryIds: string[]) {
  await db
    .delete(projectCategory)
    .where(eq(projectCategory.projectId, projectId));

  await db
    .insert(projectCategory)
    .values(categoryIds.map((categoryId) => ({ projectId, categoryId })));
}

export async function createProject(
  input: unknown
): Promise<ActionResult<{ slug: string }>> {
  const currentUser = await requireUser();
  const parsed = projectFormSchema.safeParse(input);

  if (!parsed.success) {
    return failValidation(parsed.error, "Revisa los datos del formulario");
  }

  const [existing] = await db
    .select({ total: count() })
    .from(project)
    .where(eq(project.ownerId, currentUser.id));

  if ((existing?.total ?? 0) >= MAX_PROJECTS_PER_USER) {
    return fail(`Llegaste al maximo de ${MAX_PROJECTS_PER_USER} proyectos`);
  }

  const [recent] = await db
    .select({ total: count() })
    .from(project)
    .where(
      and(
        eq(project.ownerId, currentUser.id),
        gte(project.createdAt, since(HOUR_MS))
      )
    );

  if ((recent?.total ?? 0) >= 3) {
    return fail("Estas creando proyectos muy seguido. Proba en un rato.");
  }

  const { categoryIds, ...values } = parsed.data;
  const columns = { ...values, ...normalizeOptionalLinks(parsed.data) };
  const id = nanoid();
  const slug = await uniqueSlug(values.name);
  const now = new Date();

  await db.insert(project).values({
    ...columns,
    id,
    slug,
    ownerId: currentUser.id,
    status: "pending",
    submittedAt: now,
  });

  await replaceCategories(id, categoryIds);

  await sendAdminNewSubmissionEmail({
    projectName: values.name,
    ownerName: currentUser.name,
    ownerEmail: currentUser.email,
  });

  invalidateLanding();

  return ok({ slug });
}

const IDENTITY_FIELDS = [
  "name",
  "logoUrl",
  "websiteUrl",
  "xUrl",
  "githubUrl",
  "linkedinUrl",
  "instagramUrl",
  "tiktokUrl",
  "discordUrl",
] as const;

export async function updateProject(
  projectId: string,
  input: unknown
): Promise<ActionResult<{ slug: string; requiresReview: boolean }>> {
  const currentUser = await requireUser();
  const parsed = projectFormSchema.safeParse(input);

  if (!parsed.success) {
    return failValidation(parsed.error, "Revisa los datos del formulario");
  }

  const [current] = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1);

  if (!current) {
    return fail("El proyecto no existe");
  }

  if (current.ownerId !== currentUser.id) {
    return fail("Solo el autor puede editar este proyecto");
  }

  const { categoryIds, ...values } = parsed.data;
  const columns = { ...values, ...normalizeOptionalLinks(parsed.data) };

  const identityChanged = IDENTITY_FIELDS.some(
    (field) => (columns[field] ?? null) !== (current[field] ?? null)
  );

  const requiresReview = current.status === "approved" && identityChanged;
  const nextStatus =
    current.status === "approved" && !identityChanged ? "approved" : "pending";

  await db
    .update(project)
    .set({
      ...columns,
      status: nextStatus,
      rejectionReason: null,
      submittedAt: nextStatus === "pending" ? new Date() : current.submittedAt,
    })
    .where(eq(project.id, projectId));

  await replaceCategories(projectId, categoryIds);

  invalidateLanding();

  return ok({ slug: current.slug, requiresReview });
}

export async function toggleVote(
  projectId: string
): Promise<ActionResult<{ voted: boolean }>> {
  const currentUser = await requireUser();

  const [target] = await db
    .select({ slug: project.slug, status: project.status })
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1);

  if (!target || target.status !== "approved") {
    return fail("Este proyecto todavia no esta publicado");
  }

  const [recent] = await db
    .select({ total: count() })
    .from(vote)
    .where(
      and(
        eq(vote.userId, currentUser.id),
        gte(vote.createdAt, since(MINUTE_MS))
      )
    );

  if ((recent?.total ?? 0) >= 20) {
    return fail("Demasiados votos seguidos. Espera un momento.");
  }

  const deleted = await db
    .delete(vote)
    .where(and(eq(vote.projectId, projectId), eq(vote.userId, currentUser.id)))
    .returning({ projectId: vote.projectId });

  const voted = deleted.length === 0;

  if (voted) {
    await db
      .insert(vote)
      .values({ projectId, userId: currentUser.id })
      .onConflictDoNothing();
  }

  await recalculateProjectScore(projectId);
  invalidateLanding();

  return ok({ voted });
}

export async function approveProjects(
  input: unknown
): Promise<ActionResult<{ approved: number }>> {
  const admin = await requireAdmin();
  const parsed = approveProjectsSchema.safeParse(input);

  if (!parsed.success) {
    return fail("Seleccion invalida");
  }

  const updated = await db
    .update(project)
    .set({
      status: "approved",
      rejectionReason: null,
      approvedAt: new Date(),
      reviewedById: admin.id,
    })
    .where(inArray(project.id, parsed.data.projectIds))
    .returning({
      id: project.id,
      name: project.name,
      slug: project.slug,
      ownerId: project.ownerId,
    });

  await notifyOwners(updated, (owner, row) =>
    sendProjectApprovedEmail({
      to: owner.email,
      locale: "es",
      projectName: row.name,
      projectSlug: row.slug,
    })
  );

  invalidateLanding();

  return ok({ approved: updated.length });
}

export async function rejectProjects(
  input: unknown
): Promise<ActionResult<{ rejected: number }>> {
  const admin = await requireAdmin();
  const parsed = rejectProjectSchema.safeParse(input);

  if (!parsed.success) {
    return fail("Falta el motivo del rechazo");
  }

  const updated = await db
    .update(project)
    .set({
      status: "rejected",
      rejectionReason: parsed.data.reason,
      reviewedById: admin.id,
    })
    .where(inArray(project.id, parsed.data.projectIds))
    .returning({
      id: project.id,
      name: project.name,
      slug: project.slug,
      ownerId: project.ownerId,
    });

  await notifyOwners(updated, (owner, row) =>
    sendProjectRejectedEmail({
      to: owner.email,
      locale: "es",
      projectName: row.name,
      projectSlug: row.slug,
      reason: parsed.data.reason,
    })
  );

  invalidateLanding();

  return ok({ rejected: updated.length });
}

interface OwnedRow {
  id: string;
  name: string;
  ownerId: string;
  slug: string;
}

async function notifyOwners(
  rows: OwnedRow[],
  send: (owner: { email: string }, row: OwnedRow) => Promise<void>
) {
  if (rows.length === 0) {
    return;
  }

  const owners = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(
      inArray(
        user.id,
        rows.map((row) => row.ownerId)
      )
    );

  const byId = new Map(owners.map((owner) => [owner.id, owner]));

  await Promise.all(
    rows.map((row) => {
      const owner = byId.get(row.ownerId);
      return owner ? send(owner, row) : Promise.resolve();
    })
  );
}

export async function reportProject(
  input: unknown
): Promise<ActionResult<undefined>> {
  const currentUser = await requireUser();
  const parsed = reportProjectSchema.safeParse(input);

  if (!parsed.success) {
    return fail("Conta un poco mas sobre el problema");
  }

  const [recent] = await db
    .select({ total: count() })
    .from(report)
    .where(
      and(
        eq(report.reporterId, currentUser.id),
        gte(report.createdAt, since(DAY_MS))
      )
    );

  if ((recent?.total ?? 0) >= 5) {
    return fail("Ya enviaste varios reportes hoy");
  }

  await db.insert(report).values({
    id: nanoid(),
    projectId: parsed.data.projectId,
    reporterId: currentUser.id,
    reason: parsed.data.reason,
  });

  return ok(undefined);
}

export async function resolveReport(
  reportId: string,
  action: "dismiss" | "send-to-review"
): Promise<ActionResult<undefined>> {
  await requireAdmin();

  const [target] = await db
    .select({ projectId: report.projectId })
    .from(report)
    .where(eq(report.id, reportId))
    .limit(1);

  if (!target) {
    return fail("El reporte no existe");
  }

  await db
    .update(report)
    .set({
      status: action === "dismiss" ? "dismissed" : "actioned",
      resolvedAt: new Date(),
    })
    .where(eq(report.id, reportId));

  if (action === "send-to-review") {
    await db
      .update(project)
      .set({ status: "pending", submittedAt: new Date() })
      .where(eq(project.id, target.projectId));
  }

  invalidateLanding();

  return ok(undefined);
}

export async function revalidateAlquimistaBadge(): Promise<
  ActionResult<{ isAlquimista: boolean; reason: string }>
> {
  const currentUser = await requireUser();
  const { isAlquimista, result } = await refreshAlquimistaBadge(currentUser.id);

  await recalculateScoresForVoter(currentUser.id);

  invalidateLanding();
  revalidatePath("/cuenta", "page");

  return ok({ isAlquimista, reason: result.status });
}
