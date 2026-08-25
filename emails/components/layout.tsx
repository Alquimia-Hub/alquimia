import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "react-email";
import { type EmailLocale, emailCopy, emailLocale } from "../copy";

const logoUrl = () => {
  const assets = process.env.EMAIL_ASSETS_URL;

  return assets ? `${assets}/apple-icon.png` : "/static/logo.png";
};

const COLORS = {
  bg: "#0a0806",
  card: "#141009",
  rule: "#2b2318",
  ink: "#ead9b8",
  inkMuted: "#9d8b6a",
  gold: "#d99a3d",
} as const;

interface EmailLayoutProps {
  children: ReactNode;
  locale?: EmailLocale;
  preview: string;
}

export function EmailLayout({ locale, preview, children }: EmailLayoutProps) {
  const copy = emailCopy(locale).common;
  const lang = emailLocale(locale);
  const logoSrc = logoUrl();

  return (
    <Html lang={lang}>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: { extend: { colors: COLORS } },
        }}
      >
        <Head />
        <Body className="bg-bg py-[32px] font-serif">
          <Preview>{preview}</Preview>

          <Container className="mx-auto max-w-[560px] rounded-[12px] border border-rule border-solid bg-card p-[32px]">
            <Section className="text-center">
              <Img
                alt="Alquimia"
                className="mx-auto"
                height="48"
                src={logoSrc}
                width="48"
              />
              <Text className="m-0 mt-[12px] text-[13px] text-gold uppercase tracking-[4px]">
                Alquimia
              </Text>
            </Section>

            <Hr className="my-[24px] border-rule border-solid" />

            {children}

            <Hr className="my-[24px] border-rule border-solid" />

            <Text className="m-0 text-[12px] text-inkMuted leading-[18px]">
              {copy.footer}
            </Text>
            <Text className="m-0 mt-[6px] text-[12px] leading-[18px]">
              <Link className="text-inkMuted underline" href={copy.siteUrl}>
                alquimia.community
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export const emailStyles = {
  heading: "m-0 mb-[12px] text-[22px] text-ink leading-[30px]",
  paragraph: "m-0 mb-[16px] text-[15px] text-ink leading-[24px]",
  quote:
    "m-0 mb-[20px] rounded-[6px] border-none border-gold border-l-[3px] border-solid bg-bg px-[16px] py-[12px] text-[15px] text-ink leading-[24px]",
  button:
    "box-border inline-block rounded-[8px] bg-gold px-[20px] py-[12px] text-[15px] text-bg no-underline",
  secondaryButton:
    "box-border ml-[8px] inline-block rounded-[8px] border border-rule border-solid px-[20px] py-[12px] text-[15px] text-ink no-underline",
} as const;
