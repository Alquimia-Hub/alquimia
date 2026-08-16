import { useTranslations } from "next-intl";
import { FONT_TOKENS, type FontToken } from "@/lib/brand/tokens";

export function TypographySpecimens() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {FONT_TOKENS.map((f) => (
        <Specimen font={f} key={f.name} />
      ))}
    </div>
  );
}

function PangramSample({
  font,
  fontFamily,
  text,
}: {
  font: FontToken;
  fontFamily: string;
  text: string;
}) {
  if (font.role === "ornament") {
    return (
      <p
        className="text-[22px] text-ink-2 uppercase tracking-[0.22em]"
        style={{ fontFamily }}
      >
        {text}
      </p>
    );
  }
  if (font.role === "mono") {
    return (
      <p className="text-[14px] text-ink-2" style={{ fontFamily }}>
        {text}
      </p>
    );
  }
  return (
    <p
      className="text-[20px] text-ink-2 leading-snug"
      style={{
        fontFamily,
        fontStyle: font.role === "body" ? "italic" : "normal",
      }}
    >
      {text}
    </p>
  );
}

function Specimen({ font }: { font: FontToken }) {
  const t = useTranslations("Brand");
  const fontFamily = `var(${font.cssVar})`;

  return (
    <article className="flex flex-col gap-4 rounded-sm border border-rule bg-bg-2 p-6">
      <header className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 uppercase tracking-[0.3em]">
            {t(`typographyRoles.${font.role}`)}
          </span>
          <h3 className="text-[22px] text-ink" style={{ fontFamily }}>
            {font.name}
          </h3>
        </div>
        <a
          className="font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 uppercase tracking-[0.3em] transition-colors hover:text-gold"
          href={font.googleHref}
          rel="noreferrer"
          target="_blank"
        >
          {t("googleFontsLabel")} ↗
        </a>
      </header>

      <div className="flex flex-col gap-3 border-rule border-t pt-4">
        <PangramSample
          font={font}
          fontFamily={fontFamily}
          text={t("pangram")}
        />

        <div className="flex flex-wrap gap-x-5 gap-y-1 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-3">
          <span>{font.cssVar}</span>
        </div>
      </div>
    </article>
  );
}
