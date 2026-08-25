"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";

export function ResourcesMenu({ className }: { className?: string }) {
  const t = useTranslations("Nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} data-testid="nav-resources">
        {t("resources")}
        <ChevronDown aria-hidden="true" className="size-3" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="border-rule bg-bg-2">
        <DropdownMenuItem asChild>
          <Link href="/#repos">{t("repos")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/#charlas">{t("talks")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/alquimista">{t("alquimista")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/brand">{t("brand")}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
