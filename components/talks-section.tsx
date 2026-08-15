import { useTranslations } from "next-intl";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeading } from "./section-heading";
import { TalksCarousel } from "./talks-carousel";

export function TalksSection() {
  const t = useTranslations("Talks");

  return (
    <section
      className="mx-auto w-full max-w-[1240px] scroll-mt-24 border-rule-2 border-t px-14 py-24 max-md:px-5 max-md:py-16 max-lg:px-8"
      id="charlas"
    >
      <SectionHeading
        eyebrow={t("eyebrow")}
        subtitle={t("subtitle")}
        title={t("title")}
      />

      <ScrollReveal className="mt-14 max-md:mt-10">
        <TalksCarousel />
      </ScrollReveal>
    </section>
  );
}
