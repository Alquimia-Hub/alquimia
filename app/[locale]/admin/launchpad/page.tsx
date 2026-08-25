import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignInRequired } from "@/components/auth/sign-in-required";
import { ProjectsTable } from "@/components/launchpad/admin/projects-table";
import { ReportsList } from "@/components/launchpad/admin/reports-list";
import { VotesTable } from "@/components/launchpad/admin/votes-table";
import { BackLink } from "@/components/launchpad/back-link";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { resolveLocale } from "@/i18n/locale";
import {
  countProjectsByStatus,
  countVotesByPeriod,
  listOpenReports,
  listProjectsForAdmin,
  listVotesForAdmin,
} from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";
import { adminFiltersSchema } from "@/lib/launchpad/validation";
import { cn } from "@/lib/utils";

export default async function AdminLaunchpadPage({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/launchpad">) {
  await resolveLocale(params);
  const viewer = await getViewer();

  if (!viewer) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6">
          <SignInRequired callbackURL="/admin/launchpad" />
        </main>
      </div>
    );
  }

  if (viewer.role !== "admin") {
    notFound();
  }

  const parsed = adminFiltersSchema.safeParse(await searchParams);
  const filters = parsed.success ? parsed.data : adminFiltersSchema.parse({});

  const [t, counts, projects, reports, votes, voteCounts] = await Promise.all([
    getTranslations("Admin"),
    countProjectsByStatus(),
    listProjectsForAdmin(filters.tab, filters.page, filters.q),
    listOpenReports(),
    filters.votes
      ? listVotesForAdmin(filters.page)
      : Promise.resolve({ items: [], total: 0, pageCount: 1 }),
    countVotesByPeriod(),
  ]);

  const activeTab = (() => {
    if (filters.votes) {
      return "votes";
    }

    return filters.reports ? "reports" : filters.tab;
  })();

  const tabs: { count: number; href: string; label: string; value: string }[] =
    [
      {
        value: "pending",
        href: "?tab=pending",
        label: t("tabPending"),
        count: counts.pending,
      },
      {
        value: "approved",
        href: "?tab=approved",
        label: t("tabApproved"),
        count: counts.approved,
      },
      {
        value: "rejected",
        href: "?tab=rejected",
        label: t("tabRejected"),
        count: counts.rejected,
      },
      {
        value: "reports",
        href: "?reports=1",
        label: t("tabReports"),
        count: reports.length,
      },
      {
        value: "votes",
        href: "?votes=1",
        label: t("tabVotes"),
        count: voteCounts.active,
      },
    ];

  return (
    <>
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 max-md:px-4">
          <BackLink href="/launchpad" />

          <header>
            <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
              {t("title")}
            </h1>
            <p className="mt-3 mb-0 text-ink-3">{t("subtitle")}</p>
          </header>

          <nav
            aria-label={t("sections")}
            className="flex gap-1 overflow-x-auto border border-rule-2 bg-bg-2 p-1"
          >
            {tabs.map((tab) => (
              <a
                aria-current={tab.value === activeTab ? "page" : undefined}
                className={cn(
                  "shrink-0 whitespace-nowrap px-3 py-1.5 text-sm transition-colors duration-200",
                  tab.value === activeTab
                    ? "bg-gold/15 text-gold-2"
                    : "text-ink-2 hover:bg-surface-hover hover:text-ink"
                )}
                data-testid={`tab-${tab.value}`}
                href={tab.href}
                key={tab.value}
              >
                {tab.label} ({tab.count})
              </a>
            ))}
          </nav>

          {activeTab === "votes" && (
            <VotesTable
              active={voteCounts.active}
              dayAdded={voteCounts.dayAdded}
              page={filters.page}
              pageCount={votes.pageCount}
              votes={votes.items}
              weekAdded={voteCounts.weekAdded}
            />
          )}

          {activeTab === "reports" && <ReportsList reports={reports} />}

          {activeTab === filters.tab && (
            <ProjectsTable
              page={filters.page}
              pageCount={projects.pageCount}
              projects={projects.items}
              query={filters.q ?? ""}
              tab={filters.tab}
              total={projects.total}
            />
          )}
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
