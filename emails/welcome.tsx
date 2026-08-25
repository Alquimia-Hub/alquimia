import { Button, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./components/layout";
import { type EmailLocale, emailCopy } from "./copy";

export interface WelcomeEmailProps {
  discordUrl: string;
  launchpadUrl: string;
  locale?: EmailLocale;
  name: string;
}

export function WelcomeEmail({
  locale,
  name,
  launchpadUrl,
  discordUrl,
}: WelcomeEmailProps) {
  const copy = emailCopy(locale).welcome;

  return (
    <EmailLayout locale={locale} preview={copy.subject}>
      <Text className={emailStyles.heading}>
        {copy.heading}, {name}
      </Text>
      <Text className={emailStyles.paragraph}>{copy.body}</Text>
      <Text className={emailStyles.paragraph}>{copy.alquimista}</Text>
      <Section>
        <Button className={emailStyles.button} href={launchpadUrl}>
          {copy.cta}
        </Button>
        <Button className={emailStyles.secondaryButton} href={discordUrl}>
          {copy.discordCta}
        </Button>
      </Section>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = {
  locale: "es",
  name: "Brian",
  launchpadUrl: "https://alquimia.dev/launchpad",
  discordUrl: "https://discord.gg/wkhHrWZC3Q",
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
