import { setRequestLocale } from "next-intl/server";
import { BackgroundEffects } from "@/components/background-effects";
import { HeroSection } from "@/components/hero-section";
import { LandingFooter } from "@/components/landing-footer";
import { LaunchpadSection } from "@/components/launchpad-section";
import { QuoteSection } from "@/components/quote-section";
import { ReposSection } from "@/components/repos-section";
import { SiteHeader } from "@/components/site-header";
import { TalksSection } from "@/components/talks-section";
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
      <BackgroundEffects />

      <div className="relative z-[4] flex min-h-screen flex-col">
        <SiteHeader />
        <HeroSection />
        <LaunchpadSection />
        <ReposSection />
        <TalksSection />
        <QuoteSection />
        <LandingFooter />
      </div>
    </>
  );
}
