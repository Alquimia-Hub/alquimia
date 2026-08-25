import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/launchpad/back-link";
import { ProjectForm } from "@/components/launchpad/project-form";
import { resolveLocale } from "@/i18n/locale";
import { redirect } from "@/i18n/navigation";
import type { CategoryId } from "@/lib/launchpad/categories";
import { getProjectBySlug } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";

export default async function EditProjectPage({
  params,
}: PageProps<"/[locale]/launchpad/[slug]/edit">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;

  const [viewer, project] = await Promise.all([
    getViewer(),
    getProjectBySlug(slug),
  ]);

  if (!project) {
    notFound();
  }

  if (!viewer || viewer.id !== project.ownerId) {
    redirect({ href: "/launchpad", locale });
    return null;
  }

  const t = await getTranslations("LaunchpadForm");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <BackLink href={`/launchpad/${slug}`} />

      <header>
        <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
          {t("editTitle")}
        </h1>
        <p className="mt-3 mb-0 text-ink-3">{t("editSubtitle")}</p>
      </header>

      <ProjectForm
        defaultValues={{
          name: project.name,
          tagline: project.tagline,
          description: project.description,
          logoUrl: project.logoUrl,
          websiteUrl: project.websiteUrl,
          xUrl: project.xUrl ?? "",
          githubUrl: project.githubUrl ?? "",
          linkedinUrl: project.linkedinUrl ?? "",
          instagramUrl: project.instagramUrl ?? "",
          tiktokUrl: project.tiktokUrl ?? "",
          discordUrl: project.discordUrl ?? "",
          categoryIds: project.categoryIds as CategoryId[],
        }}
        isPublished={project.status === "approved"}
        projectId={project.id}
      />
    </div>
  );
}
