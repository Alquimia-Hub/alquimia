import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignInRequired } from "@/components/auth/sign-in-required";
import { ProjectsTable } from "@/components/launchpad/admin/projects-table";
import { ReportsList } from "@/components/launchpad/admin/reports-list";
import { VotesTable } from "@/components/launchpad/admin/votes-table";
import { BackLink } from "@/components/launchpad/back-link";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveLocale } from "@/i18n/locale";
import type { ProjectStatus } from "@/lib/db/schema";
import {
  countProjectsByStatus,
  countVotesByPeriod,
  listOpenReports,
  listProjectsForAdmin,
  listVotesForAdmin,
} from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";
import { adminFiltersSchema } from "@/lib/launchpad/validation";

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

  const tabs: { count: number; label: string; value: ProjectStatus }[] = [
    { value: "pending", label: t("tabPending"), count: counts.pending },
    { value: "approved", label: t("tabApproved"), count: counts.approved },
    { value: "rejected", label: t("tabRejected"), count: counts.rejected },
  ];

  const activeTab = (() => {
    if (filters.votes) {
      return "votes";
    }

    return filters.reports ? "reports" : filters.tab;
  })();

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

          <Tabs value={activeTab}>
            <TabsList className="w-full max-w-full justify-start overflow-x-auto bg-bg-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  asChild
                  className="shrink-0"
                  data-testid={`tab-${tab.value}`}
                  key={tab.value}
                  value={tab.value}
                >
                  <a href={`?tab=${tab.value}`}>
                    {tab.label} ({tab.count})
                  </a>
                </TabsTrigger>
              ))}
              <TabsTrigger
                asChild
                className="shrink-0"
                data-testid="tab-reports"
                value="reports"
              >
                <a href="?reports=1">
                  {t("tabReports")} ({reports.length})
                </a>
              </TabsTrigger>
              <TabsTrigger
                asChild
                className="shrink-0"
                data-testid="tab-votes"
                value="votes"
              >
                <a href="?votes=1">
                  {t("tabVotes")} ({voteCounts.active})
                </a>
              </TabsTrigger>
            </TabsList>

            {activeTab === "votes" && (
              <TabsContent className="mt-6" value="votes">
                <VotesTable
                  active={voteCounts.active}
                  dayAdded={voteCounts.dayAdded}
                  dayRemoved={voteCounts.dayRemoved}
                  page={filters.page}
                  pageCount={votes.pageCount}
                  votes={votes.items}
                  weekAdded={voteCounts.weekAdded}
                  weekRemoved={voteCounts.weekRemoved}
                />
              </TabsContent>
            )}

            {activeTab === "reports" && (
              <TabsContent className="mt-6" value="reports">
                <ReportsList reports={reports} />
              </TabsContent>
            )}

            {activeTab === filters.tab && (
              <TabsContent className="mt-6" value={filters.tab}>
                <ProjectsTable
                  page={filters.page}
                  pageCount={projects.pageCount}
                  projects={projects.items}
                  query={filters.q ?? ""}
                  tab={filters.tab}
                  total={projects.total}
                />
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
