import { hasLocale } from "next-intl";
import type esMessages from "../messages/es.json";
import { routing } from "./routing";

type Messages = typeof esMessages;

export async function loadMessages(locale?: string): Promise<Messages> {
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return (await import(`../messages/${resolved}.json`)).default;
}
