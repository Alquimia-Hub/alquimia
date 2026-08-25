import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { resolveLocale } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/alternates";

const SECTIONS = [
  "who",
  "data",
  "use",
  "public",
  "cookies",
  "sharing",
  "storage",
  "retention",
  "rights",
  "minors",
  "security",
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
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    alternates: localeAlternates("/privacy", locale),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await resolveLocale(params);

  return <LegalPage namespace="Privacy" sections={SECTIONS} />;
}
