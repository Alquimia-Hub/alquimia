"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { copyText } from "@/lib/brand/download";
import { COLOR_TOKENS, type ColorToken } from "@/lib/brand/tokens";

const GROUP_ORDER: ColorToken["group"][] = ["backgrounds", "ink", "accents"];

function BadgeTag({ label }: { label: string | null }) {
  if (!label) {
    return null;
  }
  return (
    <span className="rounded-sm border border-rule px-1.5 py-0.5 font-[family-name:var(--font-im-fell)] text-[9px] text-ink-3 uppercase tracking-[0.2em]">
      {label}
    </span>
  );
}

function resolveBadge(
  contrast: ColorToken["contrast"],
  aaaLabel: string,
  aaLabel: string
): string | null {
  if (contrast === "AAA") {
    return aaaLabel;
  }
  if (contrast === "AA") {
    return aaLabel;
  }
  if (contrast === "AA-Large") {
    return `${aaLabel}·lg`;
  }
  return null;
}

export function ColorSwatches() {
  const t = useTranslations("Brand");

  return (
    <div className="flex flex-col gap-10">
      {GROUP_ORDER.map((group) => {
        const items = COLOR_TOKENS.filter((t) => t.group === group);
        return (
          <section className="flex flex-col gap-4" key={group}>
            <h3 className="font-[family-name:var(--font-im-fell)] text-[11px] text-ink-2 uppercase tracking-[0.3em]">
              {t(`colorGroups.${group}`)}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <Swatch key={t.name} token={t} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Swatch({ token }: { token: ColorToken }) {
  const t = useTranslations("Brand");
  const [copied, setCopied] = useState(false);
  const isBg = token.group === "backgrounds";

  async function handleCopy() {
    try {
      await copyText(token.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  const badge = resolveBadge(token.contrast, t("aaaLabel"), t("aaLabel"));

  return (
    <button
      aria-label={`${t("actions.copy")} ${token.hex}`}
      className="group relative flex items-stretch gap-4 rounded-sm border border-rule bg-bg-2 p-3 text-left transition-colors hover:border-gold/40 focus:outline-none focus-visible:border-gold"
      onClick={handleCopy}
      type="button"
    >
      <div
        className={[
          "h-16 w-16 shrink-0 rounded-sm",
          isBg ? "border border-rule" : "",
        ].join(" ")}
        style={{ background: token.hex }}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-im-fell)] text-[11px] text-ink uppercase tracking-[0.25em]">
            {token.name}
          </span>
          <BadgeTag label={token.decorative ? t("decorativeLabel") : badge} />
        </div>
        <span className="font-[family-name:var(--font-jetbrains)] text-[12px] text-ink-2">
          {copied ? t("actions.copied") : token.hex}
        </span>
        <span className="font-[family-name:var(--font-eb-garamond)] text-[12px] text-ink-3 italic">
          {t(`colorNotes.${token.name}`)}
        </span>
      </div>
    </button>
  );
}
