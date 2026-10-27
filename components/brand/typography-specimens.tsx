import { useTranslations } from "next-intl";
import { FONT, TYPE_STEPS } from "@/lib/brand/tokens";

export function TypographySpecimens() {
  const t = useTranslations("Brand");

  return (
    <article className="flex flex-col gap-8 bg-bg-2 p-6 max-md:p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="m-0 font-display font-medium text-ink text-title tracking-[-0.02em]">
          {FONT.name}
        </h3>
        <a
          className="text-ink-2 text-note underline transition-colors hover:text-gold"
          href={FONT.googleHref}
          rel="noreferrer"
          target="_blank"
        >
          {t("googleFontsLabel")} ↗
        </a>
      </header>

      <dl className="m-0 flex flex-col gap-8">
        {TYPE_STEPS.map((step) => (
          <div className="flex flex-col gap-2" key={step.name}>
            <dt className="text-ink-3 text-note tabular-nums">
              {t(`typeSteps.${step.name}`)} · {step.size}
            </dt>
            <dd className={`m-0 text-ink ${step.className}`}>{t("pangram")}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
