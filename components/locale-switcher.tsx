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

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const tNav = useTranslations("Nav");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={tNav("language")}
        className={cn(
          "flex items-center gap-1 px-3 py-2 font-medium text-note outline-none transition-colors duration-150 hover:text-gold",
          className
        )}
        data-testid="locale-switcher"
      >
        {t(active)}
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[10rem] bg-bg-2">
        {routing.locales.map((locale) => (
          <DropdownMenuItem asChild key={locale}>
            <Link
              aria-current={locale === active ? "true" : undefined}
              className={cn(
                "flex items-center justify-between gap-2 text-note",
                locale === active && "text-gold"
              )}
              href={pathname}
              hrefLang={locale}
              locale={locale}
            >
              {t(`${locale}Name`)}
              {locale === active && (
                <Check aria-hidden="true" className="size-4" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
