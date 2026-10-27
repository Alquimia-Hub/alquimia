import { setRequestLocale } from "next-intl/server";
import { ClosingSection } from "@/components/closing-section";
import { HeroSection } from "@/components/hero-section";
import { LandingFooter } from "@/components/landing-footer";
import { LaunchpadSection } from "@/components/launchpad-section";
import { ManifestoSection } from "@/components/manifesto-section";
import { PillarsSection } from "@/components/pillars-section";
import { SiteHeader } from "@/components/site-header";
import { WelcomeSection } from "@/components/welcome-section";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader overlay />
      <main>
        <HeroSection />
        <WelcomeSection />
        <PillarsSection />
        <LaunchpadSection />
        <ManifestoSection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </>
  );
}
