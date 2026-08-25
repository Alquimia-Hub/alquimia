import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/launchpad/back-link";
import { CategoryChip } from "@/components/launchpad/category-chip";
import { StatusChip } from "@/components/launchpad/status-chip";
import { Button } from "@/components/ui/button";
import { resolveLocale } from "@/i18n/locale";
import { Link, redirect } from "@/i18n/navigation";
import { MAX_PROJECTS_PER_USER } from "@/lib/launchpad/constants";
import { listUserProjects } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";

export default async function MyProjectsPage({
  params,
}: PageProps<"/[locale]/launchpad/my-projects">) {
  const locale = await resolveLocale(params);
  const viewer = await getViewer();

  if (!viewer) {
    redirect({ href: "/launchpad", locale });
    return null;
  }

  const [t, tLaunchpad, projects] = await Promise.all([
    getTranslations("LaunchpadMine"),
    getTranslations("Launchpad"),
    listUserProjects(viewer.id),
  ]);

  const slotsLeft = Math.max(0, MAX_PROJECTS_PER_USER - projects.length);

  return (
    <div className="flex flex-col gap-8">
      <BackLink href="/launchpad" />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
            {t("title")}
          </h1>
          <p className="mt-3 mb-0 text-ink-3">{t("subtitle")}</p>
        </div>

        {slotsLeft > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-4 uppercase tracking-[0.12em]">
              {t("slotsLeft", { count: slotsLeft })}
            </span>
            <Button asChild size="sm">
              <Link href="/launchpad/new">{tLaunchpad("submitProject")}</Link>
            </Button>
          </div>
        )}
      </header>

      {projects.length === 0 ? (
        <div className="border border-rule-2 border-dashed px-6 py-16 text-center">
          <p className="m-0 font-[family-name:var(--font-cormorant)] text-2xl text-ink-2">
            {t("emptyTitle")}
          </p>
          <p className="mt-2 mb-4 text-ink-4 text-sm">{t("emptyBody")}</p>
          <Button asChild size="sm">
            <Link href="/launchpad/new">{tLaunchpad("submitProject")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {projects.map((project) => (
            <li
              className="flex flex-wrap items-start gap-4 border border-rule-2 bg-bg-2/60 p-4"
              key={project.id}
            >
              <Image
                alt=""
                className="size-12 shrink-0 border border-rule-2 object-cover"
                height={48}
                src={project.logoUrl}
                width={48}
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="m-0 font-[family-name:var(--font-cormorant)] font-normal text-ink text-lg leading-tight">
                    {project.name}
                  </h2>
                  <StatusChip status={project.status} />
                </div>

                <p className="m-0 text-ink-3 text-sm">{project.tagline}</p>

                <div className="flex flex-wrap gap-1.5">
                  {project.categoryIds.map((categoryId) => (
                    <CategoryChip categoryId={categoryId} key={categoryId} />
                  ))}
                </div>

                {project.status === "rejected" && project.rejectionReason && (
                  <p className="m-0 border-red-500/40 border-l-2 pl-3 text-red-200 text-sm">
                    <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.12em]">
                      {t("reason")}:
                    </span>{" "}
                    {project.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/launchpad/${project.slug}`}>{t("view")}</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/launchpad/${project.slug}/edit`}>
                    {t("edit")}
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
