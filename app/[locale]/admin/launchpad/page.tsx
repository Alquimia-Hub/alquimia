import { getTranslations } from "next-intl/server";
import { ProjectsTable } from "@/components/launchpad/admin/projects-table";
import { ReportsList } from "@/components/launchpad/admin/reports-list";
import { BackLink } from "@/components/launchpad/back-link";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveLocale } from "@/i18n/locale";
import { redirect } from "@/i18n/navigation";
import { listOpenReports, listProjectsForAdmin } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";

export default async function AdminLaunchpadPage({
  params,
}: PageProps<"/[locale]/admin/launchpad">) {
  const locale = await resolveLocale(params);
  const viewer = await getViewer();

  if (viewer?.role !== "admin") {
    redirect({ href: "/launchpad", locale });
    return null;
  }

  const [t, pending, approved, rejected, reports] = await Promise.all([
    getTranslations("Admin"),
    listProjectsForAdmin("pending"),
    listProjectsForAdmin("approved"),
    listProjectsForAdmin("rejected"),
    listOpenReports(),
  ]);

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

          <Tabs defaultValue="pending">
            <TabsList className="bg-bg-2">
              <TabsTrigger data-testid="tab-pending" value="pending">
                {t("tabPending")} ({pending.length})
              </TabsTrigger>
              <TabsTrigger data-testid="tab-approved" value="approved">
                {t("tabApproved")} ({approved.length})
              </TabsTrigger>
              <TabsTrigger data-testid="tab-rejected" value="rejected">
                {t("tabRejected")} ({rejected.length})
              </TabsTrigger>
              <TabsTrigger data-testid="tab-reports" value="reports">
                {t("tabReports")} ({reports.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent className="mt-6" value="pending">
              <ProjectsTable projects={pending} />
            </TabsContent>
            <TabsContent className="mt-6" value="approved">
              <ProjectsTable projects={approved} />
            </TabsContent>
            <TabsContent className="mt-6" value="rejected">
              <ProjectsTable projects={rejected} />
            </TabsContent>
            <TabsContent className="mt-6" value="reports">
              <ReportsList reports={reports} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
