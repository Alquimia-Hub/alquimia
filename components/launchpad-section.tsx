import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTopProjects } from "@/lib/launchpad/queries";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeading } from "./section-heading";

export async function LaunchpadSection() {
  const [projects, t] = await Promise.all([
    getTopProjects(),
    getTranslations("LaunchpadLanding"),
  ]);

  return (
    <section
      className="px-14 py-24 max-md:px-6 max-md:py-16 max-lg:px-8"
      id="launchpad"
    >
      <SectionHeading
        eyebrow={t("eyebrow")}
        subtitle={t("subtitle")}
        title={t("title")}
      />

      <ScrollReveal className="mx-auto mt-12 flex max-w-3xl flex-col gap-3">
        {projects.length === 0 ? (
          <div className="border border-rule-2 border-dashed px-6 py-12 text-center">
            <Button asChild size="sm">
              <Link href="/launchpad/new">{t("emptyCta")}</Link>
            </Button>
          </div>
        ) : (
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {projects.map((project, index) => (
              <li
                className="group relative flex items-center gap-4 border border-rule-2 bg-bg-2/40 p-4 transition-colors hover:border-rule"
                key={project.id}
              >
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 text-center font-[family-name:var(--font-cormorant)] text-2xl text-ink-3 tabular-nums"
                >
                  {index + 1}
                </span>

                <Image
                  alt=""
                  className="size-12 shrink-0 border border-rule-2 object-cover"
                  height={48}
                  src={project.logoUrl}
                  width={48}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="m-0 font-[family-name:var(--font-cormorant)] font-normal text-ink text-lg leading-tight">
                    <Link
                      className="after:absolute after:inset-0 hover:text-gold-2"
                      href={`/launchpad/${project.slug}`}
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="m-0 line-clamp-1 text-ink-3 text-sm">
                    {project.tagline}
                  </p>
                </div>

                <span className="shrink-0 font-[family-name:var(--font-jetbrains)] text-gold-2 text-sm tabular-nums">
                  {project.voteScore}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4 flex justify-center">
          <Button
            asChild
            className="border-gold/40 bg-transparent text-ink-2 hover:border-gold hover:bg-gold/10 hover:text-gold-2"
            variant="outline"
          >
            <Link href="/launchpad">{t("cta")}</Link>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
