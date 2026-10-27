import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { IM_Fell_English, Literata } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/alternates";
import { publicUrl } from "@/lib/site-url";
import "../globals.css";

// Variable font: one file covers weights 400 to 600 and the optical-size
// axis, so headings and body text each get their own cut.
const literata = Literata({
  subsets: ["latin"],
  style: "normal",
  axes: ["opsz"],
  variable: "--font-literata",
  display: "swap",
});

// Italic is only for titles of works, never above the fold: a single static
// 400 cut, not preloaded. `em`, `i` and `cite` point at it in globals.css.
const literataItalic = Literata({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  variable: "--font-literata-italic",
  display: "swap",
  preload: false,
});

// Engraved display face for the landing's titles and the illuminated capital.
// One upright cut; it never sets running text.
const imFell = IM_Fell_English({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-im-fell-display",
  display: "swap",
});

const GA_MEASUREMENT_ID = "G-XJPFB512TT";

const OG_LOCALES = {
  es: "es_ES",
  en: "en_US",
} as const;

const siteUrl = new URL(publicUrl());

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");
  const path = getPathname({ href: "/", locale });

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: localeAlternates("/", locale),
    openGraph: {
      type: "website",
      url: new URL(path, siteUrl),
      siteName: "Alquimia",
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((cur) => cur !== locale)
        .map((cur) => OG_LOCALES[cur]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      className={`${literata.variable} ${literataItalic.variable} ${imFell.variable}`}
      data-scroll-behavior="smooth"
      lang={locale}
    >
      <body className="bg-bg font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
          </>
        )}
      </body>
    </html>
  );
}
