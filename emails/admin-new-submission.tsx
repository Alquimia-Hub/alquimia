import { Button, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./components/layout";
import { type EmailLocale, emailCopy } from "./copy";

export interface AdminNewSubmissionEmailProps {
  adminUrl: string;
  isResubmission?: boolean;
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
  isResubmission = false,
}: AdminNewSubmissionEmailProps) {
  const copy = emailCopy(locale).adminSubmission;

  const subject = isResubmission
    ? copy.resubmissionSubject(projectName)
    : copy.subject(projectName);

  const heading = isResubmission ? copy.resubmissionHeading : copy.heading;

  return (
    <EmailLayout locale={locale} preview={subject}>
      <Text className={emailStyles.heading}>{heading}</Text>
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
