import { and, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/launchpad/project-card";
import { ProjectFilters } from "@/components/launchpad/project-filters";
import { Button } from "@/components/ui/button";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/alternates";
import { db } from "@/lib/db";
import { vote } from "@/lib/db/schema";
import { listApprovedProjects } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";
import {
  type ProjectFilters as Filters,
  projectFiltersSchema,
} from "@/lib/launchpad/validation";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/launchpad">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Launchpad" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/launchpad", locale),
  };
}

async function votedProjectIds(userId: string, projectIds: string[]) {
  if (projectIds.length === 0) {
    return new Set<string>();
  }

  const rows = await db
    .select({ projectId: vote.projectId })
    .from(vote)
    .where(and(eq(vote.userId, userId), inArray(vote.projectId, projectIds)));

  return new Set(rows.map((row) => row.projectId));
}

function pageQuery(filters: Filters, page: number) {
  return {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.sort === "votes" ? {} : { sort: filters.sort }),
    ...(page > 1 ? { page: String(page) } : {}),
  };
}

export default async function LaunchpadPage({
  params,
  searchParams,
}: PageProps<"/[locale]/launchpad">) {
  await resolveLocale(params);

  const t = await getTranslations("Launchpad");

  const parsedFilters = projectFiltersSchema.safeParse(await searchParams);
  const filters = parsedFilters.success
    ? parsedFilters.data
    : projectFiltersSchema.parse({});

  const [viewer, { items, total, pageCount }] = await Promise.all([
    getViewer(),
    listApprovedProjects(filters),
  ]);

  const voted = viewer
    ? await votedProjectIds(
        viewer.id,
        items.map((item) => item.id)
      )
    : new Set<string>();

  const isFiltered = Boolean(filters.q || filters.category);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-[clamp(2rem,3vw+1rem,3rem)] text-ink leading-none tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 mb-0 max-w-[52ch] text-ink-3">{t("subtitle")}</p>
        </div>

        <div className="flex gap-2">
          {viewer && (
            <Button asChild size="sm" variant="ghost">
              <Link href="/launchpad/my-projects">{t("myProjects")}</Link>
            </Button>
          )}
          <Button asChild data-testid="submit-project" size="sm">
            <Link href="/launchpad/new">{t("submitProject")}</Link>
          </Button>
        </div>
      </header>

      <ProjectFilters />

      <p className="m-0 font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-4 uppercase tracking-[0.14em]">
        {t("resultCount", { count: total })}
      </p>

      {items.length === 0 ? (
        <div className="border border-rule-2 border-dashed px-6 py-16 text-center">
          <p className="m-0 font-[family-name:var(--font-cormorant)] text-2xl text-ink-2">
            {isFiltered ? t("emptySearchTitle") : t("emptyTitle")}
          </p>
          <p className="mt-2 mb-0 text-ink-3 text-sm">
            {isFiltered ? t("emptySearchBody") : t("emptyBody")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
          {items.map((item) => (
            <ProjectCard
              hasVoted={voted.has(item.id)}
              isAlquimista={viewer?.isAlquimista ?? false}
              isAuthenticated={Boolean(viewer)}
              key={item.id}
              project={item}
            />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-4">
          <Button
            asChild={filters.page > 1}
            disabled={filters.page === 1}
            size="sm"
            variant="ghost"
          >
            {filters.page > 1 ? (
              <Link
                href={{
                  pathname: "/launchpad",
                  query: pageQuery(filters, filters.page - 1),
                }}
              >
                {t("previous")}
              </Link>
            ) : (
              <span>{t("previous")}</span>
            )}
          </Button>

          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-4 tabular-nums">
            {t("pageOf", { page: filters.page, total: pageCount })}
          </span>

          <Button
            asChild={filters.page < pageCount}
            disabled={filters.page === pageCount}
            size="sm"
            variant="ghost"
          >
            {filters.page < pageCount ? (
              <Link
                href={{
                  pathname: "/launchpad",
                  query: pageQuery(filters, filters.page + 1),
                }}
              >
                {t("next")}
              </Link>
            ) : (
              <span>{t("next")}</span>
            )}
          </Button>
        </nav>
      )}
    </div>
  );
}
