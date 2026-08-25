import { useTranslations } from "next-intl";
import { QuoteOrnament } from "./icons";
import { ScrollReveal } from "./scroll-reveal";

export function QuoteSection() {
  const t = useTranslations("Quote");

  return (
    <ScrollReveal className="mx-auto w-full max-w-[620px] px-14 py-20 max-md:px-6 max-md:py-14 max-lg:px-8">
      <figure className="flex flex-col items-center gap-4.5 text-center">
        <QuoteOrnament className="h-8 w-8 text-gold opacity-80" />
        <blockquote className="m-0 p-0 font-[family-name:var(--font-cormorant)] font-light text-[clamp(1.15rem,1.2vw+0.5rem,1.375rem)] text-ink-2 italic leading-[1.5]">
          &ldquo;{t("text")}&rdquo;
        </blockquote>
        <figcaption className="flex items-center gap-2.5 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.3em]">
          <span className="h-px w-6 bg-rule" />— {t("author")}
        </figcaption>
      </figure>
    </ScrollReveal>
  );
}
