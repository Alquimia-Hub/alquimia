import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async (params) => {
  // An explicit locale (e.g. `getTranslations({locale})`) wins, so build-time
  // functions like `generateImageMetadata` never have to touch `headers()`.
  const requested = params.locale ?? (await params.requestLocale);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
