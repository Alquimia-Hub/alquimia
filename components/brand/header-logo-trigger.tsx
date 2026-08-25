"use client";

import { useTranslations } from "next-intl";
import { AlquimiaLogo } from "@/components/icons";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Link } from "@/i18n/navigation";
import { LogoContextMenuContent } from "./logo-context-menu";

export function HeaderLogoTrigger() {
  const t = useTranslations("Common");

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          aria-label={t("brand")}
          className="flex w-fit select-none items-center gap-3 font-[family-name:var(--font-im-fell)] text-[11px] text-ink uppercase tracking-[0.34em] transition-colors hover:text-ink-2 max-sm:gap-2 max-sm:text-[10px] max-sm:tracking-[0.18em]"
          href="/"
        >
          <AlquimiaLogo className="h-[26px] w-[26px] shrink-0 text-gold transition-colors group-hover:text-gold-2 max-sm:h-[22px] max-sm:w-[22px]" />
          <span className="truncate">{t("brand")}</span>
        </Link>
      </ContextMenuTrigger>
      <LogoContextMenuContent showViewBrand variant="horizontal" />
    </ContextMenu>
  );
}
