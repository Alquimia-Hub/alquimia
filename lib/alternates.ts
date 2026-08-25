import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";

export function localeAlternates(
  href: string,
  locale: Locale
): Metadata["alternates"] {
  const languages: Record<string, string> = {
    "x-default": getPathname({ href, locale: routing.defaultLocale }),
  };

  for (const cur of routing.locales) {
    languages[cur] = getPathname({ href, locale: cur });
  }

  return {
    canonical: getPathname({ href, locale }),
    languages,
  };
}
