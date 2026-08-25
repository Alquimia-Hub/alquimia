import { Button, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./components/layout";
import { type EmailLocale, emailCopy } from "./copy";

export interface ProjectApprovedEmailProps {
  locale?: EmailLocale;
  projectName: string;
  projectUrl: string;
}

export function ProjectApprovedEmail({
  locale,
  projectName,
  projectUrl,
}: ProjectApprovedEmailProps) {
  const copy = emailCopy(locale).approved;

  return (
    <EmailLayout locale={locale} preview={copy.subject(projectName)}>
      <Text className={emailStyles.heading}>{copy.heading}</Text>
      <Text className={emailStyles.paragraph}>{copy.body(projectName)}</Text>
      <Section>
        <Button className={emailStyles.button} href={projectUrl}>
          {copy.cta}
        </Button>
      </Section>
    </EmailLayout>
  );
}

ProjectApprovedEmail.PreviewProps = {
  locale: "es",
  projectName: "Mi Proyecto",
  projectUrl: "https://alquimia.dev/launchpad/mi-proyecto",
} satisfies ProjectApprovedEmailProps;

export default ProjectApprovedEmail;
