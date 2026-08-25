import { Globe, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CategoryChip } from "@/components/launchpad/category-chip";
import { DeleteProjectButton } from "@/components/launchpad/delete-project-button";
import { ReportDialog } from "@/components/launchpad/report-dialog";
import { ShareOnX } from "@/components/launchpad/share-on-x";
import { StatusChip } from "@/components/launchpad/status-chip";
import { VoteButton } from "@/components/launchpad/vote-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/alternates";
import { getProjectBySlug, hasUserVoted } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";
import { withUtm } from "@/lib/launchpad/utm";
import { OPTIONAL_LINK_FIELDS } from "@/lib/launchpad/validation";
import { publicUrl } from "@/lib/site-url";

const FIELD_SUFFIX = /Url$/;

const LINK_LABELS: Record<(typeof OPTIONAL_LINK_FIELDS)[number], string> = {
  xUrl: "X",
  githubUrl: "GitHub",
  linkedinUrl: "LinkedIn",
  instagramUrl: "Instagram",
  tiktokUrl: "TikTok",
  discordUrl: "Discord",
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/launchpad/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  if (project.status !== "approved") {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: `${project.name} | Alquimia Launchpad`,
    description: project.tagline,
    alternates: localeAlternates(`/launchpad/${slug}`, locale as "es" | "en"),
    openGraph: {
      title: project.name,
      description: project.tagline,
      images: [{ url: project.logoUrl }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: PageProps<"/[locale]/launchpad/[slug]">) {
  await resolveLocale(params);
  const { slug } = await params;
  const { submitted } = await searchParams;

  const [viewer, project] = await Promise.all([
    getViewer(),
    getProjectBySlug(slug),
  ]);

  if (!project) {
    notFound();
  }

  const isOwner = viewer?.id === project.ownerId;
  const isAdmin = viewer?.role === "admin";

  if (project.status !== "approved" && !(isOwner || isAdmin)) {
    notFound();
  }

  const [tDetail, tSuccess, voted] = await Promise.all([
    getTranslations("LaunchpadDetail"),
    getTranslations("LaunchpadSuccess"),
    viewer ? hasUserVoted(project.id, viewer.id) : Promise.resolve(false),
  ]);

  const justSubmitted = isOwner && submitted === "1";

  const launchpadUrl = new URL("/launchpad", publicUrl()).href;

  const links = OPTIONAL_LINK_FIELDS.filter((field) => project[field]).map(
    (field) => ({
      label: LINK_LABELS[field],
      href: withUtm(project[field] as string, field.replace(FIELD_SUFFIX, "")),
    })
  );

  return (
    <article className="flex flex-col gap-8">
      <Link
        className="font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-4 uppercase tracking-[0.14em] hover:text-gold"
        href="/launchpad"
      >
        ← {tDetail("backToList")}
      </Link>

      {justSubmitted && (
        <aside
          className="border border-gold/40 bg-gold/5 px-6 py-6"
          data-testid="submitted-panel"
        >
          <h2 className="mt-0 mb-2 font-[family-name:var(--font-cormorant)] font-light text-2xl text-ink">
            {tSuccess("title")}
          </h2>
          <p className="m-0 text-ink-2">{tSuccess("body")}</p>

          <hr className="my-5 border-0 border-rule-2 border-t" />

          <h3 className="mt-0 mb-1 font-medium text-gold-2 text-sm">
            {tSuccess("shareTitle")}
          </h3>
          <p className="mt-0 mb-4 text-ink-3 text-sm">
            {tSuccess("shareBody")}
          </p>
          <ShareOnX launchpadUrl={launchpadUrl} projectName={project.name} />
        </aside>
      )}

      {isOwner && !justSubmitted && project.status === "pending" && (
        <aside
          className="flex flex-wrap items-center justify-between gap-4 border border-amber-500/30 bg-amber-500/5 px-5 py-4"
          data-testid="pending-banner"
        >
          <p className="m-0 font-medium text-amber-100">
            {tDetail("pendingBanner")}
          </p>
          <ShareOnX
            label={tDetail("shareOnX")}
            launchpadUrl={launchpadUrl}
            projectName={project.name}
          />
        </aside>
      )}

      {isOwner && project.status === "rejected" && project.rejectionReason && (
        <aside
          className="border border-red-500/30 bg-red-500/5 px-5 py-4"
          data-testid="rejected-banner"
        >
          <p className="m-0 font-medium text-red-100">
            {tDetail("rejectedBanner")}
          </p>
          <p className="mt-2 mb-0 text-ink-2 text-sm">
            {project.rejectionReason}
          </p>
        </aside>
      )}

      <header className="flex flex-wrap items-start gap-6">
        <Image
          alt=""
          className="size-24 shrink-0 border border-rule object-cover"
          height={96}
          src={project.logoUrl}
          width={96}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-4xl text-ink leading-none">
              {project.name}
            </h1>
            {project.status !== "approved" && (
              <StatusChip status={project.status} />
            )}
          </div>

          <p className="m-0 text-ink-2">{project.tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {project.categoryIds.map((categoryId) => (
              <CategoryChip categoryId={categoryId} key={categoryId} />
            ))}
          </div>
        </div>

        {project.status === "approved" && (
          <VoteButton
            hasVoted={voted}
            isAlquimista={viewer?.isAlquimista ?? false}
            isAuthenticated={Boolean(viewer)}
            isOwner={isOwner}
            projectId={project.id}
            score={project.voteScore}
            size="lg"
          />
        )}
      </header>

      <div className="grid grid-cols-[1fr_240px] gap-10 max-lg:grid-cols-1">
        <section>
          <h2 className="mt-0 mb-3 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.28em]">
            {tDetail("about")}
          </h2>
          <p className="m-0 whitespace-pre-wrap text-ink-2 leading-relaxed">
            {project.description}
          </p>
        </section>

        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="mt-0 mb-3 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.28em]">
              {tDetail("links")}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              <li>
                <a
                  className="inline-flex items-center gap-2 text-ink-2 text-sm hover:text-gold"
                  href={withUtm(project.websiteUrl, "website")}
                  rel="noopener nofollow"
                  target="_blank"
                >
                  <Globe className="size-4" />
                  {tDetail("website")}
                </a>
              </li>
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-ink-2 text-sm hover:text-gold"
                    href={link.href}
                    rel="noopener nofollow"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mt-0 mb-3 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.28em]">
              {tDetail("publishedBy")}
            </h2>
            <div className="flex items-center gap-2">
              <Avatar className="size-7 border border-rule-2">
                <AvatarImage alt="" src={project.owner.image ?? undefined} />
                <AvatarFallback className="bg-bg-3 text-[10px]">
                  {project.owner.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-ink-2 text-sm">{project.owner.name}</span>
              {project.owner.isAlquimista && (
                <span className="border border-gold/40 bg-gold/10 px-1.5 py-0.5 font-[family-name:var(--font-jetbrains)] text-[9px] text-gold-2 uppercase tracking-[0.1em]">
                  Alquimista
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isOwner && (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/launchpad/${slug}/edit`}>
                    <Pencil className="size-4" />
                    {tDetail("editProject")}
                  </Link>
                </Button>
                {project.status !== "approved" && (
                  <DeleteProjectButton
                    projectId={project.id}
                    projectName={project.name}
                    redirectTo="/launchpad/my-projects"
                  />
                )}
              </>
            )}
            {viewer && !isOwner && project.status === "approved" && (
              <ReportDialog projectId={project.id} />
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
