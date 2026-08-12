import { BackgroundEffects } from "@/components/background-effects";
import { HeroSection } from "@/components/hero-section";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHeader } from "@/components/landing-header";
import { ReposSection } from "@/components/repos-section";
import { TalksSection } from "@/components/talks-section";

export default function Home() {
  return (
    <>
      <BackgroundEffects />

      <div className="relative z-[4] flex min-h-screen flex-col">
        <LandingHeader />
        <HeroSection />
        <ReposSection />
        <TalksSection />
        <LandingFooter />
      </div>
    </>
  );
}
