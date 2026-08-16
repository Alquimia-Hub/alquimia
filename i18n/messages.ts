import { hasLocale } from "next-intl";
import type esMessages from "../messages/es.json";
import { routing } from "./routing";

type Messages = typeof esMessages;

/**
 * Loads a message catalog straight from disk, bypassing the request-scoped
 * config. Needed in build-time contexts such as metadata image routes, where
 * Next may invoke the module before any route params are resolved.
 */
export async function loadMessages(locale?: string): Promise<Messages> {
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return (await import(`../messages/${resolved}.json`)).default;
}
