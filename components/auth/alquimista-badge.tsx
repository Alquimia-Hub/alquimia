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
  sm: "gap-1 px-2 py-0.5 text-note",
  md: "gap-1.5 px-2.5 py-1 text-note",
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
            "inline-flex items-center bg-bg-3 text-gold leading-tight transition-colors duration-200 hover:bg-surface-active hover:text-ink",
            SIZES[size],
            className
          )}
          href="/alquimista"
        >
          <Sparkles aria-hidden="true" className={ICON_SIZES[size]} />
          {t("name")}
        </Link>
      </TooltipTrigger>
      <TooltipContent className="max-w-64" side="top">
        <p className="m-0 font-medium text-gold">{t("tooltipTitle")}</p>
        <p className="mt-1 mb-0 text-ink-2 leading-snug">{t("tooltipBody")}</p>
        <p className="mt-1.5 mb-0 text-ink-3">{t("tooltipLink")}</p>
      </TooltipContent>
    </Tooltip>
  );
}
