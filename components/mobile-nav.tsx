"use client";

import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const tLocale = useTranslations("LocaleSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        aria-label={t("menu")}
        className={cn(
          "flex size-11 items-center justify-center text-ink outline-none transition-colors duration-150 hover:text-gold",
          className
        )}
        data-testid="mobile-nav-trigger"
      >
        <Menu aria-hidden="true" className="size-6" />
      </SheetTrigger>

      <SheetContent
        className="w-[min(22rem,88vw)] gap-0 border-0 bg-bg-2 px-7 pt-16 pb-8"
        data-testid="mobile-nav"
        side="right"
      >
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>

        <nav aria-label={t("main")}>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {SITE_SECTIONS.map((section) => (
              <li key={section.key}>
                <Link
                  className="block py-3 font-medium text-ink text-lead transition-colors duration-150 hover:text-gold"
                  href={section.href}
                  onClick={() => setOpen(false)}
                >
                  {t(section.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-10">
          <span className="text-ink-3 text-note">{t("language")}</span>
          <div className="flex gap-2">
            {routing.locales.map((locale) => (
              <Link
                aria-current={locale === activeLocale ? "true" : undefined}
                className={cn(
                  "px-4 py-2.5 text-note transition-colors duration-150",
                  locale === activeLocale
                    ? "bg-ink font-semibold text-on-light"
                    : "bg-bg-3 text-ink hover:bg-surface-active"
                )}
                href={pathname}
                hrefLang={locale}
                key={locale}
                locale={locale}
                onClick={() => setOpen(false)}
              >
                {tLocale(`${locale}Name`)}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
