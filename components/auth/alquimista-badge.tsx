"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "gap-1 px-2 py-0.5 text-[9px]",
  md: "gap-1.5 px-2.5 py-1 text-[10px]",
} as const;

const ICON_SIZES = {
  sm: "size-3",
  md: "size-3.5",
} as const;

export function AlquimistaBadge({
  className,
  size = "sm",
}: {
  className?: string;
  size?: keyof typeof SIZES;
}) {
  const t = useTranslations("Alquimista");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          className={cn(
            "inline-flex items-center border border-gold/50 bg-gradient-to-r from-gold/25 via-gold/10 to-elixir/20 font-[family-name:var(--font-jetbrains)] text-gold-2 uppercase tracking-[0.12em] shadow-[0_0_18px_-8px_var(--gold)] transition-colors duration-200 hover:border-gold hover:text-ink",
            SIZES[size],
            className
          )}
          href="/alquimista"
        >
          <Sparkles
            aria-hidden="true"
            className={cn("fill-gold/40", ICON_SIZES[size])}
          />
          {t("name")}
        </Link>
      </TooltipTrigger>
      <TooltipContent className="max-w-64 border-gold/40" side="top">
        <p className="m-0 font-medium text-gold-2">{t("tooltipTitle")}</p>
        <p className="mt-1 mb-0 text-ink-2 leading-snug">{t("tooltipBody")}</p>
        <p className="mt-1.5 mb-0 text-ink-3">{t("tooltipLink")}</p>
      </TooltipContent>
    </Tooltip>
  );
}
