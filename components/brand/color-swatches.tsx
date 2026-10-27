"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { copyText } from "@/lib/brand/download";
import { COLOR_TOKENS, type ColorToken } from "@/lib/brand/tokens";

export function ColorSwatches() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {COLOR_TOKENS.map((token) => (
        <Swatch key={token.name} token={token} />
      ))}
    </div>
  );
}

function Swatch({ token }: { token: ColorToken }) {
  const t = useTranslations("Brand");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await copyText(token.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      aria-label={`${t("actions.copy")} ${token.stage} ${token.hex}`}
      className="group flex flex-col gap-4 bg-bg-2 p-3 text-left transition-colors hover:bg-bg-3"
      onClick={handleCopy}
      type="button"
    >
      <div
        className="flex h-28 items-end px-4 py-3 font-display font-medium text-lead"
        style={{ background: token.hex, color: token.textHex }}
      >
        Aa
      </div>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <span className="font-display font-medium text-ink text-xl tracking-[-0.02em]">
          {token.stage}
        </span>
        <span className="text-ink-2 text-note">
          {t(`colorNotes.${token.name}`)}
        </span>
        <span className="text-ink-3 text-note tabular-nums">
          {copied ? t("actions.copied") : token.hex}
          {" · "}
          {t("aaaLabel")} {token.contrastRatio.toFixed(1)}:1
        </span>
      </div>
    </button>
  );
}
