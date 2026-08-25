import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/launchpad/back-link";
import { ProjectForm } from "@/components/launchpad/project-form";
import { resolveLocale } from "@/i18n/locale";
import { redirect } from "@/i18n/navigation";
import { MAX_PROJECTS_PER_USER } from "@/lib/launchpad/constants";
import { countUserProjects } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";

export default async function NewProjectPage({
  params,
}: PageProps<"/[locale]/launchpad/new">) {
  const locale = await resolveLocale(params);
  const viewer = await getViewer();

  if (!viewer) {
    redirect({ href: "/launchpad", locale });
    return null;
  }

  const t = await getTranslations("LaunchpadForm");
  const used = await countUserProjects(viewer.id);
  const limitReached = used >= MAX_PROJECTS_PER_USER;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <BackLink href="/launchpad" />

      <header>
        <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
          {t("createTitle")}
        </h1>
        <p className="mt-3 mb-0 text-ink-3">{t("createSubtitle")}</p>
      </header>

      {limitReached ? (
        <p
          className="border border-rule-2 border-dashed px-4 py-6 text-center text-ink-3"
          data-testid="limit-reached"
        >
          {t("limitReached", { max: MAX_PROJECTS_PER_USER })}
        </p>
      ) : (
        <ProjectForm />
      )}
    </div>
  );
}
