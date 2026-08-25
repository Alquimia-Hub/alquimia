"use client";

import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const tNav = useTranslations("Nav");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={tNav("language")}
        className="nav-link flex items-center gap-1 px-2 py-2 text-ink-3 outline-none transition-colors duration-200 hover:text-gold"
        data-testid="locale-switcher"
      >
        {t(active)}
        <ChevronDown aria-hidden="true" className="size-3" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[9rem] border-rule bg-bg-2"
      >
        {routing.locales.map((locale) => (
          <DropdownMenuItem asChild key={locale}>
            <Link
              aria-current={locale === active ? "true" : undefined}
              className={cn(
                "flex items-center justify-between gap-2",
                locale === active && "text-gold"
              )}
              href={pathname}
              hrefLang={locale}
              locale={locale}
            >
              {t(`${locale}Name`)}
              {locale === active && (
                <Check aria-hidden="true" className="size-3.5" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
