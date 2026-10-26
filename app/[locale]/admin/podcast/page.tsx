import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { SignInRequired } from "@/components/auth/sign-in-required";
import { CandidatesTable } from "@/components/podcast/admin/candidates-table";
import { CurateButton } from "@/components/podcast/admin/curate-button";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { resolveLocale } from "@/i18n/locale";
import { getViewer } from "@/lib/launchpad/session";
import { getLatestCurationRun } from "@/lib/podcast/curation/queries";

// A run fetches every source in parallel, each with its own timeout.
export const maxDuration = 60;

export default async function AdminPodcastPage({
  params,
}: PageProps<"/[locale]/admin/podcast">) {
  await resolveLocale(params);
  const viewer = await getViewer();

  if (!viewer) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6">
          <SignInRequired callbackURL="/admin/podcast" />
        </main>
      </div>
    );
  }

  if (viewer.role !== "admin") {
    notFound();
  }

  const [t, format, run] = await Promise.all([
    getTranslations("PodcastAdmin"),
    getFormatter(),
    getLatestCurationRun(),
  ]);

  const formatDate = (date: Date) =>
    format.dateTime(date, { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 max-md:px-4">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
                {t("title")}
              </h1>
              <p className="mt-3 mb-0 text-ink-3">{t("subtitle")}</p>
            </div>
            <CurateButton />
          </header>

          {run ? (
            <>
              <dl className="m-0 grid grid-cols-3 gap-px border border-rule-2 bg-rule-2 max-sm:grid-cols-1">
                {[
                  { label: t("lastRun"), value: formatDate(run.createdAt) },
                  {
                    label: t("window"),
                    value: `${formatDate(run.windowStart)} → ${formatDate(run.windowEnd)}`,
                  },
                  { label: t("status"), value: t(`status_${run.status}`) },
                ].map((item) => (
                  <div
                    className="flex flex-col gap-1 bg-bg-2 px-5 py-4"
                    key={item.label}
                  >
                    <dt className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-3 uppercase tracking-[0.14em]">
                      {item.label}
                    </dt>
                    <dd className="m-0 text-ink text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {run.sourceErrors.length > 0 && (
                <div
                  className="flex gap-3 border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100 text-sm"
                  role="alert"
                >
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <div>
                    <p className="m-0 font-medium">
                      {run.status === "failed"
                        ? t("runFailed")
                        : t("sourceErrors")}
                    </p>
                    <ul className="mt-2 mb-0 pl-4">
                      {run.sourceErrors.map((error) => (
                        <li key={`${error.source}:${error.message}`}>
                          <span className="font-[family-name:var(--font-jetbrains)] uppercase">
                            {error.source}
                          </span>
                          : {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <section className="flex flex-col gap-3">
                <h2 className="m-0 font-[family-name:var(--font-jetbrains)] text-[11px] text-gold-2 uppercase tracking-[0.14em]">
                  {t("top", { count: run.top.length })}
                </h2>
                {run.top.length > 0 ? (
                  <CandidatesTable candidates={run.top} showPosition />
                ) : (
                  <p className="border border-rule-2 border-dashed px-6 py-12 text-center text-ink-3">
                    {t("topEmpty")}
                  </p>
                )}
              </section>

              {run.rest.length > 0 && (
                <details className="group flex flex-col gap-3">
                  <summary className="cursor-pointer font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-2 uppercase tracking-[0.14em] hover:text-gold-2">
                    {t("rest", { count: run.rest.length })}
                  </summary>
                  <div className="mt-3">
                    <CandidatesTable
                      candidates={run.rest}
                      showPosition={false}
                    />
                  </div>
                </details>
              )}
            </>
          ) : (
            <p className="border border-rule-2 border-dashed px-6 py-12 text-center text-ink-3">
              {t("empty")}
            </p>
          )}
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
