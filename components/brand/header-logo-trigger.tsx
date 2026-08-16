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
          className="flex w-fit select-none items-center gap-3 font-[family-name:var(--font-im-fell)] text-[11px] text-ink uppercase tracking-[0.34em] transition-colors hover:text-ink-2"
          href="/"
        >
          <AlquimiaLogo className="h-[26px] w-[26px] text-gold transition-colors group-hover:text-gold-2" />
          <span>{t("brand")}</span>
        </Link>
      </ContextMenuTrigger>
      <LogoContextMenuContent showViewBrand variant="horizontal" />
    </ContextMenu>
  );
}
