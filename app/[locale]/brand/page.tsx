import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ColorSwatches } from "@/components/brand/color-swatches";
import { LogoCard } from "@/components/brand/logo-card";
import { TypographySpecimens } from "@/components/brand/typography-specimens";
import { LandingFooter } from "@/components/landing-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/alternates";
import { LOGO_VARIANTS } from "@/lib/brand/tokens";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("brandTitle"),
    description: t("brandDescription"),
    alternates: localeAlternates("/brand", locale),
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Brand");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />

      <main className="flex-1 px-14 pt-10 pb-24 max-md:px-6 max-lg:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-20">
          <header className="flex animate-entrance animate-fade-up flex-col items-center gap-3 text-center">
            <h1 className="m-0 font-display font-medium text-ink text-title tracking-[-0.02em]">
              {t("title")}
            </h1>
            <p className="m-0 max-w-xl text-body text-ink-2">{t("subtitle")}</p>
          </header>

          <Section title={t("sections.logo")}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {LOGO_VARIANTS.map((v) => (
                <LogoCard key={v.id} variant={v.id} />
              ))}
            </div>
          </Section>

          <Section title={t("sections.colors")}>
            <ColorSwatches />
          </Section>

          <Section title={t("sections.typography")}>
            <TypographySpecimens />
          </Section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="m-0 font-display font-medium text-ink text-lead tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
