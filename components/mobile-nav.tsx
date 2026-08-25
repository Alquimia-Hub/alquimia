"use client";

import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AlquimiaLogo } from "@/components/icons";
import { SocialLinks } from "@/components/social-links";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/launchpad", key: "launchpad" },
  { href: "/#repos", key: "repos" },
  { href: "/#charlas", key: "talks" },
  { href: "/alquimista", key: "alquimista" },
  { href: "/brand", key: "brand" },
] as const;

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
          "flex size-9 items-center justify-center text-ink-2 outline-none transition-colors duration-200 hover:text-gold",
          className
        )}
        data-testid="mobile-nav-trigger"
      >
        <Menu aria-hidden="true" className="size-5" />
      </SheetTrigger>

      <SheetContent
        className="w-[min(20rem,85vw)] gap-0 border-rule-2 bg-bg-2 px-6 py-6"
        data-testid="mobile-nav"
        side="right"
      >
        <SheetTitle className="flex items-center gap-3 font-[family-name:var(--font-im-fell)] font-normal text-[11px] text-ink uppercase tracking-[0.3em]">
          <AlquimiaLogo className="size-6 text-gold" />
          {t("menu")}
        </SheetTitle>

        <nav className="mt-8 flex flex-col">
          {SECTIONS.map((section) => (
            <Link
              className="border-rule-2 border-b py-4 font-[family-name:var(--font-cormorant)] text-ink text-xl transition-colors duration-200 hover:text-gold-2"
              href={section.href}
              key={section.key}
              onClick={() => setOpen(false)}
            >
              {t(section.key)}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <span className="font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-3 uppercase tracking-[0.14em]">
            {t("language")}
          </span>
          <div className="flex gap-2">
            {routing.locales.map((locale) => (
              <Link
                aria-current={locale === activeLocale ? "true" : undefined}
                className={cn(
                  "border px-3 py-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.12em] transition-colors duration-200",
                  locale === activeLocale
                    ? "border-gold/60 bg-gold/10 text-gold-2"
                    : "border-rule-2 text-ink-2 hover:border-gold/50 hover:text-gold-2"
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

        <SocialLinks className="mt-8" />
      </SheetContent>
    </Sheet>
  );
}
