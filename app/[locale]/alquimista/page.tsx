import {
  BriefcaseBusiness,
  CalendarClock,
  MessagesSquare,
  Newspaper,
  Sparkles,
  Swords,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingFooter } from "@/components/landing-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/alternates";
import { COMMUNITY_LINKS } from "@/lib/constants";

const BENEFITS = [
  { id: "calls", Icon: CalendarClock },
  { id: "news", Icon: Newspaper },
  { id: "networking", Icon: UsersRound },
  { id: "jobs", Icon: BriefcaseBusiness },
  { id: "hackathons", Icon: Swords },
  { id: "debate", Icon: MessagesSquare },
] as const;

const STEPS = ["join", "link", "vote"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("alquimistaTitle"),
    description: t("alquimistaDescription"),
    alternates: localeAlternates("/alquimista", locale),
  };
}

export default async function AlquimistaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await resolveLocale(params);
  const t = await getTranslations("Alquimista");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />

      <main className="flex-1 px-14 pt-10 pb-24 max-md:px-6 max-lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
          <header className="flex animate-entrance animate-fade-up flex-col items-center gap-4 text-center">
            <h1 className="m-0 font-display font-medium text-ink text-title tracking-[-0.02em]">
              {t("title")}
            </h1>

            <p className="m-0 max-w-xl text-body text-ink-2">{t("intro")}</p>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a
                  href={COMMUNITY_LINKS.discord}
                  rel="noopener"
                  target="_blank"
                >
                  {t("ctaJoin")}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/account">{t("ctaVerify")}</Link>
              </Button>
            </div>
          </header>

          <section className="flex flex-col gap-6 bg-bg-2 px-8 py-8 max-md:px-6">
            <h2 className="m-0 font-display font-medium text-ink text-lead tracking-[-0.02em]">
              {t("whatTitle")}
            </h2>
            <p className="m-0 text-body text-ink-2">{t("whatBody")}</p>
            <p className="m-0 flex items-start gap-3 text-body text-ink">
              <Sparkles
                aria-hidden="true"
                className="mt-1.5 size-4 shrink-0 text-gold"
              />
              {t("weightedVote")}
            </p>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h2 className="m-0 font-display font-medium text-ink text-lead tracking-[-0.02em]">
                {t("benefitsTitle")}
              </h2>
            </div>

            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 max-sm:grid-cols-1">
              {BENEFITS.map(({ id, Icon }) => (
                <li
                  className="flex flex-col gap-2 bg-bg-2 px-6 py-6 transition-colors duration-300 hover:bg-surface-hover"
                  key={id}
                >
                  <Icon aria-hidden="true" className="size-5 text-gold" />
                  <h3 className="m-0 font-display font-medium text-ink text-xl leading-tight tracking-[-0.02em]">
                    {t(`benefits.${id}.title`)}
                  </h3>
                  <p className="m-0 text-ink-3 text-sm leading-relaxed">
                    {t(`benefits.${id}.body`)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h2 className="m-0 font-display font-medium text-ink text-lead tracking-[-0.02em]">
                {t("stepsTitle")}
              </h2>
            </div>

            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              {STEPS.map((step, index) => (
                <li className="flex items-start gap-4" key={step}>
                  <span className="flex size-8 shrink-0 items-center justify-center bg-bg-3 text-gold text-sm tabular-nums">
                    {index + 1}
                  </span>
                  <div>
                    <p className="m-0 font-medium text-ink">
                      {t(`steps.${step}.title`)}
                    </p>
                    <p className="mt-1 mb-0 text-ink-3 text-sm leading-relaxed">
                      {t(`steps.${step}.body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="m-0 text-ink-3 text-sm">{t("freeNote")}</p>
          </section>

          <section className="flex flex-col items-center gap-4 bg-bg-2 px-8 py-10 text-center max-md:px-6">
            <h2 className="m-0 font-display font-medium text-ink text-lead tracking-[-0.02em]">
              {t("closingTitle")}
            </h2>
            <p className="m-0 max-w-lg text-ink-2">{t("closingBody")}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a
                  href={COMMUNITY_LINKS.discord}
                  rel="noopener"
                  target="_blank"
                >
                  {t("ctaJoin")}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/launchpad">{t("ctaLaunchpad")}</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
