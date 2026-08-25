import { Button, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./components/layout";
import { type EmailLocale, emailCopy } from "./copy";

export interface AdminNewSubmissionEmailProps {
  adminUrl: string;
  locale?: EmailLocale;
  ownerEmail: string;
  ownerName: string;
  projectName: string;
}

export function AdminNewSubmissionEmail({
  locale,
  projectName,
  ownerName,
  ownerEmail,
  adminUrl,
}: AdminNewSubmissionEmailProps) {
  const copy = emailCopy(locale).adminSubmission;

  return (
    <EmailLayout locale={locale} preview={copy.subject(projectName)}>
      <Text className={emailStyles.heading}>{copy.heading}</Text>
      <Text className={emailStyles.paragraph}>{projectName}</Text>
      <Text className={emailStyles.paragraph}>
        {copy.by}: {ownerName} ({ownerEmail})
      </Text>
      <Section>
        <Button className={emailStyles.button} href={adminUrl}>
          {copy.cta}
        </Button>
      </Section>
    </EmailLayout>
  );
}

AdminNewSubmissionEmail.PreviewProps = {
  locale: "es",
  projectName: "Mi Proyecto",
  ownerName: "Brian",
  ownerEmail: "brian@alquimia.dev",
  adminUrl: "https://alquimia.dev/admin/launchpad",
} satisfies AdminNewSubmissionEmailProps;

export default AdminNewSubmissionEmail;
