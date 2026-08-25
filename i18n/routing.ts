import { defineRouting } from "next-intl/routing";

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",

  localePrefix: "as-needed",
  localeCookie: {
    maxAge: ONE_YEAR_IN_SECONDS,
  },
});

export type Locale = (typeof routing.locales)[number];
