import { defineRouting } from "next-intl/routing";

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // Spanish keeps the bare URLs it already had (`/`, `/brand`); English lives
  // under `/en`. Visitors are sent to their locale by the `accept-language`
  // header on first visit, and the cookie remembers the manual choice after.
  localePrefix: "as-needed",
  localeCookie: {
    maxAge: ONE_YEAR_IN_SECONDS,
  },
});

export type Locale = (typeof routing.locales)[number];
