"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * `ES · EN` toggle. Rendered as real anchors so it works before hydration and
 * stays crawlable — next-intl emits the prefixed href on purpose so the
 * middleware can refresh the locale cookie before landing on the final URL.
 */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <ul
      aria-label={t("label")}
      className={`flex items-center gap-1.5 font-[family-name:var(--font-im-fell)] text-[10px] tracking-[0.3em] ${className}`}
    >
      {routing.locales.map((locale, index) => {
        const isActive = locale === active;

        return (
          <li className="flex items-center gap-1.5" key={locale}>
            {index > 0 && (
              <span aria-hidden="true" className="text-ink-4">
                ·
              </span>
            )}
            <Link
              aria-current={isActive ? "true" : undefined}
              className={`nav-link px-1 py-2 transition-colors duration-200 hover:text-gold ${
                isActive ? "text-gold" : "text-ink-3"
              }`}
              href={pathname}
              hrefLang={locale}
              locale={locale}
              title={t(`${locale}Name`)}
            >
              {t(locale)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
