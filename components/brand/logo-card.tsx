"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { downloadPng, downloadSvg } from "@/lib/brand/download";
import {
  LOGO_VARIANTS,
  type LogoVariantId,
  PNG_SIZES,
  type PngSize,
} from "@/lib/brand/tokens";
import { LogoContextMenuContent } from "./logo-context-menu";

interface Props {
  variant: LogoVariantId;
}

const DEFAULT_PNG_SIZE: PngSize = 1024;

function aspectClassWide(isWide: boolean) {
  return isWide ? "aspect-[4/1] py-8" : "aspect-[3/2] py-10";
}

export function LogoCard({ variant }: Props) {
  const t = useTranslations("Brand");
  const name = t(`logoVariants.${variant}.name`);
  const meta = LOGO_VARIANTS.find((x) => x.id === variant);
  const [pngSize, setPngSize] = useState<PngSize>(DEFAULT_PNG_SIZE);

  if (!meta) {
    throw new Error(`Unknown logo variant: ${variant}`);
  }

  const aspect = meta.width / meta.height;
  const isWide = aspect > 2;
  const isSquareish = aspect < 1.5;
  const aspectClass = isSquareish
    ? "aspect-square py-10"
    : aspectClassWide(isWide);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <article className="group flex flex-col gap-5 rounded-sm border border-rule bg-bg-2 p-6 transition-colors hover:border-gold/40">
          {/* Preview */}
          <div
            className={[
              "flex items-center justify-center rounded-sm border border-rule/60 bg-bg-3 px-8",
              aspectClass,
            ].join(" ")}
          >
            <Image
              alt={name}
              className="max-h-full max-w-full text-ink"
              height={meta.height}
              src={meta.svgPath}
              style={{ color: "var(--ink)" }}
              width={meta.width}
            />
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <h3 className="font-[family-name:var(--font-im-fell)] text-[11px] text-ink uppercase tracking-[0.3em]">
              {name}
            </h3>
            <p className="font-[family-name:var(--font-eb-garamond)] text-[13px] text-ink-3 italic">
              {t(`logoVariants.${variant}.desc`)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 rounded-sm border border-rule px-3 py-1.5 font-[family-name:var(--font-im-fell)] text-[10px] text-ink uppercase tracking-[0.3em] transition-colors hover:border-gold hover:text-gold"
              onClick={() => {
                downloadSvg(variant);
              }}
              type="button"
            >
              {t("actions.downloadSvg")}
            </button>

            <button
              className="inline-flex items-center gap-1.5 rounded-sm border border-rule px-3 py-1.5 font-[family-name:var(--font-im-fell)] text-[10px] text-ink uppercase tracking-[0.3em] transition-colors hover:border-gold hover:text-gold"
              onClick={() => {
                downloadPng(variant, "light", pngSize);
              }}
              type="button"
            >
              {t("actions.downloadPng")}
            </button>

            <div className="ml-1 flex items-center gap-1 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-3">
              {PNG_SIZES.map((size) => (
                <button
                  aria-pressed={pngSize === size}
                  className={[
                    "rounded-sm border px-1.5 py-1 transition-colors",
                    pngSize === size
                      ? "border-gold text-gold"
                      : "border-transparent hover:text-ink-2",
                  ].join(" ")}
                  key={size}
                  onClick={() => setPngSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </article>
      </ContextMenuTrigger>

      <LogoContextMenuContent showViewBrand={false} variant={variant} />
    </ContextMenu>
  );
}
