"use server";

import { and, count, eq, inArray, ne, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import type { EmailLocale } from "@/emails/copy";
import { db } from "@/lib/db";
import { project, projectCategory, report, user, vote } from "@/lib/db/schema";
import {
  sendAdminNewSubmissionEmail,
  sendProjectApprovedEmail,
  sendProjectRejectedEmail,
} from "@/lib/mail/send";
import { type ActionResult, fail, ok } from "./action-result";
import {
  ALQUIMISTA_CHECK_TTL_MS,
  MAX_PROJECTS_PER_USER,
  RATE_LIMITS,
  VOTE_WEIGHT_ALQUIMISTA,
  VOTE_WEIGHT_DEFAULT,
} from "./constants";
import { refreshAlquimistaBadge } from "./discord";
import { consumeRateLimit, pruneRateLimits } from "./rate-limit";
import {
  ForbiddenError,
  requireAdmin,
  requireUser,
  UnauthorizedError,
} from "./session";
import { isReservedSlug, slugify } from "./slug";
import { deleteProjectLogo } from "./storage";
import {
  approveProjectsSchema,
  normalizeOptionalLinks,
  projectFormSchema,
  REVIEWABLE_FIELDS,
  rejectProjectSchema,
  reportProjectSchema,
} from "./validation";

const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(error: unknown): boolean {
  let current = error;

  for (let depth = 0; depth < 5; depth++) {
    if (typeof current !== "object" || current === null) {
      return false;
    }

    if ((current as { code?: string }).code === UNIQUE_VIOLATION) {
      return true;
    }

    current = (current as { cause?: unknown }).cause;
  }

  return false;
}

async function withActionErrors<T>(body: () => Promise<ActionResult<T>>) {
  try {
    return await body();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return fail("unauthorized");
    }

    if (error instanceof ForbiddenError) {
      return fail("forbidden");
    }

    process.stderr.write(`[launchpad] ${String(error)}\n`);

    return fail("unexpected");
  }
}

async function withinRateLimit(
  scope: keyof typeof RATE_LIMITS,
  subject: string
) {
  const { limit: max, windowMs } = RATE_LIMITS[scope];
  const allowed = await consumeRateLimit(scope, subject, max, windowMs);

  await pruneRateLimits();

  return allowed;
}

function invalidate(slug?: string) {
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/launchpad", "page");
  revalidatePath("/[locale]/launchpad/my-projects", "page");

  if (slug) {
    revalidatePath(`/[locale]/launchpad/${slug}`, "page");
  }
}

const ALQUIMISTA_TTL_DAYS = Math.round(
  ALQUIMISTA_CHECK_TTL_MS / (24 * 60 * 60 * 1000)
);

const WEIGHT_CASE = sql.raw(
  `case when u.is_alquimista and u.alquimista_checked_at > now() - interval '${ALQUIMISTA_TTL_DAYS} days' then ${VOTE_WEIGHT_ALQUIMISTA} else ${VOTE_WEIGHT_DEFAULT} end`
);

async function recalculateProjectScore(projectId: string) {
  await db.execute(sql`
    update ${project} set
      vote_score = coalesce((
        select sum(${WEIGHT_CASE})
        from ${vote} v join ${user} u on u.id = v.user_id
        where v.project_id = ${projectId}
      ), 0)
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

const SLUG_SUFFIX_LENGTH = 5;

async function candidateSlug(name: string, withSuffix: boolean) {
  const base = slugify(name) || "proyecto";
  const needsSuffix = withSuffix || isReservedSlug(base);

  if (!needsSuffix) {
    const [existing] = await db
      .select({ slug: project.slug })
      .from(project)
      .where(eq(project.slug, base))
      .limit(1);

    if (!existing) {
      return base;
    }
  }

  return `${base}-${nanoid(SLUG_SUFFIX_LENGTH).toLowerCase()}`;
}

const MAX_SLUG_ATTEMPTS = 5;

async function insertProjectWithSlug(
  values: Omit<typeof project.$inferInsert, "slug">,
  name: string,
  categoryIds: string[]
) {
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const slug = await candidateSlug(name, attempt > 0);

    try {
      return await db.transaction(async (tx) => {
        await tx.insert(project).values({ ...values, slug });
        await tx.insert(projectCategory).values(
          categoryIds.map((categoryId) => ({
            projectId: values.id as string,
            categoryId,
          }))
        );

        return slug;
      });
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
    }
  }

  return null;
}

export async function createProject(
  input: unknown
): Promise<ActionResult<{ slug: string }>> {
  return await withActionErrors(async () => {
    const currentUser = await requireUser();
    const parsed = projectFormSchema.safeParse(input);

    if (!parsed.success) {
      return fail("invalidForm");
    }

    if (!(await withinRateLimit("createProject", currentUser.id))) {
      return fail("tooFast");
    }

    const [existing] = await db
      .select({ total: count() })
      .from(project)
      .where(eq(project.ownerId, currentUser.id));

    if ((existing?.total ?? 0) >= MAX_PROJECTS_PER_USER) {
      return fail("projectLimitReached", { max: MAX_PROJECTS_PER_USER });
    }

    const { categoryIds, ...values } = parsed.data;
    const now = new Date();

    const slug = await insertProjectWithSlug(
      {
        ...values,
        ...normalizeOptionalLinks(parsed.data),
        id: nanoid(),
        ownerId: currentUser.id,
        status: "pending",
        submittedAt: now,
      },
      values.name,
      categoryIds
    );

    if (!slug) {
      return fail("slugTaken");
    }

    await sendAdminNewSubmissionEmail({
      projectName: values.name,
      ownerName: currentUser.name,
      ownerEmail: currentUser.email,
      isResubmission: false,
    });

    invalidate();

    return ok({ slug });
  });
}

export async function updateProject(
  projectId: string,
  input: unknown
): Promise<ActionResult<{ requiresReview: boolean; slug: string }>> {
  return await withActionErrors(async () => {
    const currentUser = await requireUser();
    const parsed = projectFormSchema.safeParse(input);

    if (!parsed.success) {
      return fail("invalidForm");
    }

    if (!(await withinRateLimit("updateProject", currentUser.id))) {
      return fail("tooFast");
    }

    const [current] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);

    if (!current) {
      return fail("notFound");
    }

    if (current.ownerId !== currentUser.id) {
      return fail("notOwner");
    }

    const { categoryIds, ...values } = parsed.data;
    const columns = { ...values, ...normalizeOptionalLinks(parsed.data) };

    const contentChanged = REVIEWABLE_FIELDS.some(
      (field) => (columns[field] ?? null) !== (current[field] ?? null)
    );

    const [previousCategories, nextCategories] = [
      new Set(await currentCategoryIds(projectId)),
      new Set(categoryIds),
    ];

    const categoriesChanged =
      previousCategories.size !== nextCategories.size ||
      [...nextCategories].some((id) => !previousCategories.has(id));

    const changed = contentChanged || categoriesChanged;
    const wasApproved = current.status === "approved";
    const requiresReview = wasApproved && changed;
    const nextStatus = wasApproved && !changed ? "approved" : "pending";

    await db.transaction(async (tx) => {
      await tx
        .update(project)
        .set({
          ...columns,
          status: nextStatus,
          rejectionReason: null,
          submittedAt:
            nextStatus === "pending" ? new Date() : current.submittedAt,
        })
        .where(eq(project.id, projectId));

      await tx
        .delete(projectCategory)
        .where(eq(projectCategory.projectId, projectId));

      await tx
        .insert(projectCategory)
        .values(categoryIds.map((categoryId) => ({ projectId, categoryId })));
    });

    if (columns.logoUrl !== current.logoUrl) {
      await deleteProjectLogo(current.logoUrl);
    }

    if (requiresReview || (current.status === "rejected" && changed)) {
      await sendAdminNewSubmissionEmail({
        projectName: columns.name,
        ownerName: currentUser.name,
        ownerEmail: currentUser.email,
        isResubmission: true,
      });
    }

    invalidate(current.slug);

    return ok({ slug: current.slug, requiresReview });
  });
}

async function currentCategoryIds(projectId: string) {
  const rows = await db
    .select({ categoryId: projectCategory.categoryId })
    .from(projectCategory)
    .where(eq(projectCategory.projectId, projectId));

  return rows.map((row) => row.categoryId);
}

export async function deleteProject(
  projectId: string
): Promise<ActionResult<undefined>> {
  return await withActionErrors(async () => {
    const currentUser = await requireUser();

    if (!(await withinRateLimit("deleteProject", currentUser.id))) {
      return fail("tooFast");
    }

    const [current] = await db
      .select({
        ownerId: project.ownerId,
        slug: project.slug,
        status: project.status,
        logoUrl: project.logoUrl,
      })
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);

    if (!current) {
      return fail("notFound");
    }

    const owns = current.ownerId === currentUser.id;

    if (!(owns || currentUser.role === "admin")) {
      return fail("notOwner");
    }

    if (current.status === "approved" && !(currentUser.role === "admin")) {
      return fail("cannotDeleteApproved");
    }

    await db.delete(project).where(eq(project.id, projectId));
    await deleteProjectLogo(current.logoUrl);

    invalidate(current.slug);

    return ok(undefined);
  });
}

export async function toggleVote(
  projectId: string
): Promise<ActionResult<{ voted: boolean }>> {
  return await withActionErrors(async () => {
    const currentUser = await requireUser();

    if (!(await withinRateLimit("vote", currentUser.id))) {
      return fail("tooFast");
    }

    const [target] = await db
      .select({ slug: project.slug, status: project.status })
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);

    if (!target || target.status !== "approved") {
      return fail("notPublished");
    }

    const deleted = await db
      .delete(vote)
      .where(
        and(eq(vote.projectId, projectId), eq(vote.userId, currentUser.id))
      )
      .returning({ projectId: vote.projectId });

    const voted = deleted.length === 0;

    if (voted) {
      await db
        .insert(vote)
        .values({ projectId, userId: currentUser.id })
        .onConflictDoNothing();
    }

    await recalculateProjectScore(projectId);
    invalidate(target.slug);

    return ok({ voted });
  });
}

export async function approveProjects(
  input: unknown
): Promise<ActionResult<{ approved: number }>> {
  return await withActionErrors(async () => {
    const admin = await requireAdmin();
    const parsed = approveProjectsSchema.safeParse(input);

    if (!parsed.success) {
      return fail("invalidForm");
    }

    const now = new Date();

    const updated = await db
      .update(project)
      .set({
        status: "approved",
        rejectionReason: null,
        approvedAt: now,
        reviewedAt: now,
        reviewedById: admin.id,
      })
      .where(
        and(
          inArray(project.id, parsed.data.projectIds),
          ne(project.status, "approved")
        )
      )
      .returning({
        id: project.id,
        name: project.name,
        slug: project.slug,
        ownerId: project.ownerId,
      });

    await notifyOwners(updated, (owner, row) =>
      sendProjectApprovedEmail({
        to: owner.email,
        locale: owner.locale,
        projectName: row.name,
        projectSlug: row.slug,
      })
    );

    invalidate();

    return ok({ approved: updated.length });
  });
}

export async function rejectProjects(
  input: unknown
): Promise<ActionResult<{ rejected: number }>> {
  return await withActionErrors(async () => {
    const admin = await requireAdmin();
    const parsed = rejectProjectSchema.safeParse(input);

    if (!parsed.success) {
      return fail("invalidForm");
    }

    const updated = await db
      .update(project)
      .set({
        status: "rejected",
        rejectionReason: parsed.data.reason,
        reviewedAt: new Date(),
        reviewedById: admin.id,
      })
      .where(
        and(
          inArray(project.id, parsed.data.projectIds),
          ne(project.status, "rejected")
        )
      )
      .returning({
        id: project.id,
        name: project.name,
        slug: project.slug,
        ownerId: project.ownerId,
      });

    await notifyOwners(updated, (owner, row) =>
      sendProjectRejectedEmail({
        to: owner.email,
        locale: owner.locale,
        projectName: row.name,
        projectSlug: row.slug,
        reason: parsed.data.reason,
      })
    );

    invalidate();

    return ok({ rejected: updated.length });
  });
}

interface OwnedRow {
  id: string;
  name: string;
  ownerId: string;
  slug: string;
}

interface Owner {
  email: string;
  locale: EmailLocale;
}

async function notifyOwners(
  rows: OwnedRow[],
  send: (owner: Owner, row: OwnedRow) => Promise<void>
) {
  if (rows.length === 0) {
    return;
  }

  const owners = await db
    .select({ id: user.id, email: user.email, locale: user.locale })
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

      return owner
        ? send(
            {
              email: owner.email,
              locale: owner.locale === "en" ? "en" : "es",
            },
            row
          )
        : Promise.resolve();
    })
  );
}

export async function reportProject(
  input: unknown
): Promise<ActionResult<undefined>> {
  return await withActionErrors(async () => {
    const currentUser = await requireUser();
    const parsed = reportProjectSchema.safeParse(input);

    if (!parsed.success) {
      return fail("invalidForm");
    }

    if (!(await withinRateLimit("report", currentUser.id))) {
      return fail("tooFast");
    }

    const [target] = await db
      .select({ id: project.id, status: project.status })
      .from(project)
      .where(eq(project.id, parsed.data.projectId))
      .limit(1);

    if (!target || target.status !== "approved") {
      return fail("notPublished");
    }

    try {
      await db.insert(report).values({
        id: nanoid(),
        projectId: parsed.data.projectId,
        reporterId: currentUser.id,
        reason: parsed.data.reason,
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return fail("alreadyReported");
      }

      throw error;
    }

    return ok(undefined);
  });
}

export async function resolveReport(
  reportId: string,
  action: "dismiss" | "send-to-review"
): Promise<ActionResult<undefined>> {
  return await withActionErrors(async () => {
    const admin = await requireAdmin();

    const [target] = await db
      .select({ projectId: report.projectId })
      .from(report)
      .where(eq(report.id, reportId))
      .limit(1);

    if (!target) {
      return fail("notFound");
    }

    await db
      .update(report)
      .set({
        status: action === "dismiss" ? "dismissed" : "actioned",
        resolvedAt: new Date(),
      })
      .where(eq(report.id, reportId));

    if (action === "send-to-review") {
      const [moved] = await db
        .update(project)
        .set({
          status: "pending",
          submittedAt: new Date(),
          reviewedById: admin.id,
        })
        .where(eq(project.id, target.projectId))
        .returning({ slug: project.slug });

      invalidate(moved?.slug);
    }

    revalidatePath("/[locale]/admin/launchpad", "page");

    return ok(undefined);
  });
}

export async function revalidateAlquimistaBadge(): Promise<
  ActionResult<{ isAlquimista: boolean; reason: string }>
> {
  return await withActionErrors(async () => {
    const currentUser = await requireUser();

    if (!(await withinRateLimit("badgeRefresh", currentUser.id))) {
      return fail("tooFast");
    }

    const { isAlquimista, result } = await refreshAlquimistaBadge(
      currentUser.id
    );

    await recalculateScoresForVoter(currentUser.id);

    invalidate();
    revalidatePath("/[locale]/account", "page");

    return ok({ isAlquimista, reason: result.status });
  });
}
