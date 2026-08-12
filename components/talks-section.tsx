import { SITE_CONTENT } from "@/lib/constants";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeading } from "./section-heading";
import { TalksCarousel } from "./talks-carousel";

export function TalksSection() {
  return (
    <section
      className="mx-auto w-full max-w-[1240px] scroll-mt-24 border-rule-2 border-t px-14 py-24 max-md:px-5 max-md:py-16 max-lg:px-8"
      id="charlas"
    >
      <SectionHeading
        eyebrow={SITE_CONTENT.talks.eyebrow}
        subtitle={SITE_CONTENT.talks.subtitle}
        title={SITE_CONTENT.talks.title}
      />

      <ScrollReveal className="mt-14 max-md:mt-10">
        <TalksCarousel />
      </ScrollReveal>
    </section>
  );
}
