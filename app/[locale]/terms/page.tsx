import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { resolveLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/alternates";

const SECTIONS = [
  "about",
  "account",
  "publishing",
  "content",
  "votes",
  "ownership",
  "moderation",
  "thirdParties",
  "warranty",
  "liability",
  "changes",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
    alternates: localeAlternates("/terms", locale),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await resolveLocale(params);

  return <LegalPage namespace="Terms" sections={SECTIONS} />;
}
