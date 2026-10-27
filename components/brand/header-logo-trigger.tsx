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
          className="group flex w-fit select-none items-center gap-3 py-1 font-semibold text-body text-ink tracking-[-0.01em]"
          href="/"
        >
          <AlquimiaLogo className="size-8 shrink-0 text-gold transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[120deg]" />
          {t("brand")}
        </Link>
      </ContextMenuTrigger>
      <LogoContextMenuContent showViewBrand variant="horizontal" />
    </ContextMenu>
  );
}
