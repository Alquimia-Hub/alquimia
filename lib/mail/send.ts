import "server-only";
import { AdminNewSubmissionEmail } from "@/emails/admin-new-submission";
import { type EmailLocale, emailCopy } from "@/emails/copy";
import { ProjectApprovedEmail } from "@/emails/project-approved";
import { ProjectRejectedEmail } from "@/emails/project-rejected";
import { WelcomeEmail } from "@/emails/welcome";
import { COMMUNITY_LINKS } from "@/lib/constants";
import { env } from "@/lib/env";
import { publicUrl } from "@/lib/site-url";
import { FROM_EMAIL, resend } from "./client";

interface SendArgs {
  react: React.ReactNode;
  subject: string;
  to: string;
}

async function send({ to, subject, react }: SendArgs) {
  if (!resend) {
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    react,
  });

  if (error) {
    process.stderr.write(`[mail] fallo el envio a ${to}: ${error.message}\n`);
  }
}

const absoluteUrl = (path: string) => new URL(path, publicUrl()).href;

process.env.EMAIL_ASSETS_URL = publicUrl();

const localizedPath = (locale: EmailLocale, path: string) =>
  locale === "en" ? `/en${path}` : path;

export function sendWelcomeEmail(args: {
  to: string;
  name: string;
  locale: EmailLocale;
}) {
  const { locale } = args;

  return send({
    to: args.to,
    subject: emailCopy(locale).welcome.subject,
    react: WelcomeEmail({
      locale,
      name: args.name,
      launchpadUrl: absoluteUrl(localizedPath(locale, "/launchpad")),
      discordUrl: COMMUNITY_LINKS.discord,
    }),
  });
}

export function sendProjectApprovedEmail(args: {
  to: string;
  locale: EmailLocale;
  projectName: string;
  projectSlug: string;
}) {
  const { locale } = args;

  return send({
    to: args.to,
    subject: emailCopy(locale).approved.subject(args.projectName),
    react: ProjectApprovedEmail({
      locale,
      projectName: args.projectName,
      projectUrl: absoluteUrl(
        localizedPath(locale, `/launchpad/${args.projectSlug}`)
      ),
    }),
  });
}

export function sendProjectRejectedEmail(args: {
  to: string;
  locale: EmailLocale;
  projectName: string;
  projectSlug: string;
  reason: string;
}) {
  const { locale } = args;

  return send({
    to: args.to,
    subject: emailCopy(locale).rejected.subject(args.projectName),
    react: ProjectRejectedEmail({
      locale,
      projectName: args.projectName,
      reason: args.reason,
      editUrl: absoluteUrl(
        localizedPath(locale, `/launchpad/${args.projectSlug}/edit`)
      ),
    }),
  });
}

export function sendAdminNewSubmissionEmail(args: {
  projectName: string;
  ownerName: string;
  ownerEmail: string;
}) {
  if (!env.RESEND_ADMIN_EMAIL) {
    return Promise.resolve();
  }

  const locale: EmailLocale = "es";

  return send({
    to: env.RESEND_ADMIN_EMAIL,
    subject: emailCopy(locale).adminSubmission.subject(args.projectName),
    react: AdminNewSubmissionEmail({
      locale,
      projectName: args.projectName,
      ownerName: args.ownerName,
      ownerEmail: args.ownerEmail,
      adminUrl: absoluteUrl("/admin/launchpad"),
    }),
  });
}
