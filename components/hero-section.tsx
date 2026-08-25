import { useTranslations } from "next-intl";
import { PILLAR_IDS } from "@/lib/constants";
import { CommunityCta } from "./community-cta";
import {
  AlquimiaDivider,
  AutomatizacionIcon,
  InteligenciaIcon,
  ProductividadIcon,
} from "./icons";
import { ScrollReveal } from "./scroll-reveal";

const PILLAR_ICONS = {
  inteligencia: InteligenciaIcon,
  automatizacion: AutomatizacionIcon,
  productividad: ProductividadIcon,
} as const;

export function HeroSection() {
  const t = useTranslations("Hero");
  const tPillars = useTranslations("Pillars");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-14 py-8 pb-10 text-center max-md:px-5 max-md:py-6 max-md:pb-8 max-lg:px-8">
      <div
        className="mb-3 flex animate-entrance animate-fade-down items-center gap-4 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.42em]"
        style={{ "--delay": "200ms" } as React.CSSProperties}
      >
        <span className="h-px w-14 bg-rule" />
        <span className="h-[5px] w-[5px] rotate-45 bg-gold" />
        <span>{t("eyebrow")}</span>
        <span className="h-[5px] w-[5px] rotate-45 bg-gold" />
        <span className="h-px w-14 bg-rule" />
      </div>

      <h1
        className="m-0 animate-entrance animate-fade-up font-[family-name:var(--font-cormorant)] font-normal text-[clamp(3rem,6.5vw+0.5rem,5.75rem)] text-ink leading-[0.88] tracking-[-0.03em]"
        style={{ "--delay": "300ms" } as React.CSSProperties}
      >
        {t("title")}
        <em className="font-light text-gold italic">{t("titleAccent")}</em>
        <span className="sr-only">{t("titleSrSuffix")}</span>
      </h1>

      <div
        className="my-4 flex w-full max-w-[440px] animate-entrance animate-scale-x items-center justify-center gap-4.5"
        style={{ "--delay": "500ms" } as React.CSSProperties}
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rule to-transparent" />
        <AlquimiaDivider className="h-6 w-6 text-gold" />
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rule to-transparent" />
      </div>

      <p
        className="m-0 mb-5 max-w-[600px] animate-entrance animate-fade-in font-[family-name:var(--font-cormorant)] font-light text-[clamp(1.15rem,1.5vw+0.5rem,1.625rem)] text-ink-2 italic leading-[1.4]"
        id="manifiesto"
        style={{ "--delay": "600ms" } as React.CSSProperties}
      >
        {t("subtitle")}
      </p>

      <CommunityCta />

      <ScrollReveal className="mt-12 w-full" id="pilares">
        <div className="grid grid-cols-3 gap-0 border-rule-2 border-t border-b max-md:grid-cols-1">
          {PILLAR_IDS.map((pillarId, index) => {
            const IconComponent = PILLAR_ICONS[pillarId];
            return (
              <div
                className={`px-8 py-5 text-center ${
                  index < PILLAR_IDS.length - 1
                    ? "border-rule-2 border-r max-md:border-r-0 max-md:border-b"
                    : ""
                }`}
                key={pillarId}
              >
                <IconComponent className="mx-auto mb-2.5 h-5 w-5 text-gold" />
                <div className="mb-1 font-[family-name:var(--font-im-fell)] text-[11px] text-ink uppercase tracking-[0.24em]">
                  {tPillars(`${pillarId}.title`)}
                </div>
                <div className="font-[family-name:var(--font-eb-garamond)] text-[13px] text-ink-3 italic">
                  {tPillars(`${pillarId}.description`)}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </main>
  );
}
