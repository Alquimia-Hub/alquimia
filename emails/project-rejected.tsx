import { Button, Section, Text } from "react-email";
import { EmailLayout, emailStyles } from "./components/layout";
import { type EmailLocale, emailCopy } from "./copy";

export interface ProjectRejectedEmailProps {
  editUrl: string;
  locale?: EmailLocale;
  projectName: string;
  reason: string;
}

export function ProjectRejectedEmail({
  locale,
  projectName,
  reason,
  editUrl,
}: ProjectRejectedEmailProps) {
  const copy = emailCopy(locale).rejected;

  return (
    <EmailLayout locale={locale} preview={copy.subject(projectName)}>
      <Text className={emailStyles.heading}>{copy.heading}</Text>
      <Text className={emailStyles.paragraph}>{copy.body(projectName)}</Text>
      <Text className={emailStyles.quote}>{reason}</Text>
      <Text className={emailStyles.paragraph}>{copy.note}</Text>
      <Section>
        <Button className={emailStyles.button} href={editUrl}>
          {copy.cta}
        </Button>
      </Section>
    </EmailLayout>
  );
}

ProjectRejectedEmail.PreviewProps = {
  locale: "es",
  projectName: "Mi Proyecto",
  reason: "El logo no se ve y el link al sitio da 404.",
  editUrl: "https://alquimia.dev/launchpad/mi-proyecto/editar",
} satisfies ProjectRejectedEmailProps;

export default ProjectRejectedEmail;
