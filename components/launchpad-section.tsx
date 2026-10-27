import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SOCIAL_LINKS } from "@/lib/constants";
import { fetchOrgRepos, isCuratedRepo } from "@/lib/github";
import { getTopProjects } from "@/lib/launchpad/queries";
import { revealIndex } from "@/lib/reveal";
import { GithubIcon } from "./icons";
import { Plate } from "./scene-picture";
import { ScrollReveal } from "./scroll-reveal";

const ALBEDO_BUTTON =
  "inline-flex min-h-14 items-center gap-3 bg-albedo px-7 font-semibold text-body text-on-light transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--albedo)_70%,white)] active:translate-y-px max-sm:w-full max-sm:justify-center";

const DARK_RUBEDO = "bg-[color-mix(in_oklab,var(--rubedo)_80%,black)]";
const DARK_RUBEDO_HOVER =
  "hover:bg-[color-mix(in_oklab,var(--rubedo)_66%,black)]";

/**
 * "Lo que construye la comunidad", on rubedo: what comes out of the
 * workshop. The most supported Launchpad projects, then the open repos of
 * the Laboratory with their stars and last change.
 */
export async function LaunchpadSection() {
  const [projects, repos, t, tVote, tRepos, format] = await Promise.all([
    getTopProjects().catch(() => []),
    fetchOrgRepos(),
    getTranslations("LaunchpadLanding"),
    getTranslations("LaunchpadVote"),
    getTranslations("Repos"),
    getFormatter(),
  ]);
  // Only the curated repos carry a description written for this page.
  const rows = repos.flatMap((repo) =>
    isCuratedRepo(repo.name)
      ? [{ ...repo, description: tRepos(`descriptions.${repo.name}`) }]
      : []
  );
  const now = new Date();

  return (
    <section
      aria-labelledby="launchpad-title"
      className="bg-rubedo text-albedo"
      id="launchpad"
    >
      <ScrollReveal className="section-frame">
        <div data-reveal-item style={revealIndex(0)}>
          <Plate
            alt=""
            className="aspect-[3/1] w-full max-md:aspect-[2/1]"
            name="obra"
            position="50% 40%"
            sizes="(max-width: 1440px) 100vw, 1280px"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 items-end gap-x-6 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2
              className="m-0 font-heading font-normal text-title"
              data-reveal-item
              id="launchpad-title"
              style={revealIndex(1)}
            >
              {t("title")}
            </h2>
            <p
              className="m-0 mt-5 max-w-[46ch] text-body"
              data-reveal-item
              style={revealIndex(2)}
            >
              {t("subtitle")}
            </p>
          </div>
          {projects.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:justify-end"
              data-reveal-item
              style={revealIndex(3)}
            >
              <Link className={ALBEDO_BUTTON} href="/launchpad">
                {t("cta")}
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
              <Link className="link-quiet text-body" href="/launchpad/new">
                {t("publish")}
              </Link>
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="mt-10" data-reveal-item style={revealIndex(3)}>
            <Link className={ALBEDO_BUTTON} href="/launchpad/new">
              {t("emptyCta")}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        ) : (
          <ol className="m-0 mt-10 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-3">
            {projects.map((project, index) => (
              <li
                data-reveal-item
                key={project.id}
                style={revealIndex(Math.min(index + 4, 8))}
              >
                <Link
                  className={`group flex h-full flex-col gap-5 p-6 transition-colors duration-150 ${DARK_RUBEDO} ${DARK_RUBEDO_HOVER}`}
                  href={`/launchpad/${project.slug}`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <Image
                      alt=""
                      className="size-16 shrink-0 bg-albedo object-cover"
                      height={64}
                      src={project.logoUrl}
                      width={64}
                    />
                    <span className="font-semibold text-body tabular-nums">
                      {tVote("points", { count: project.voteScore })}
                    </span>
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-semibold text-lead leading-tight underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-current">
                      {project.name}
                    </span>
                    <span className="line-clamp-2 text-body">
                      {project.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <div
          className="mt-[clamp(4rem,7vw,6rem)] grid scroll-mt-8 grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12"
          id="laboratorio"
        >
          <div
            className="flex flex-col lg:col-span-4"
            data-reveal-item
            style={revealIndex(0)}
          >
            <h3 className="m-0 font-heading font-normal text-title">
              {tRepos("title")}
            </h3>
            <p className="m-0 mt-5 max-w-[34ch] text-body">
              {tRepos("subtitle")}
            </p>
            <a
              className="link-quiet mt-6 inline-flex items-center gap-2.5 self-start font-medium text-body"
              href={SOCIAL_LINKS.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon className="size-5" />
              {tRepos("cta")}
            </a>
          </div>

          <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:col-span-8">
            {rows.map((repo, index) => (
              <li
                data-reveal-item
                key={repo.name}
                style={revealIndex(Math.min(index + 1, 6))}
              >
                <a
                  className={`group flex h-full flex-col gap-2 p-6 transition-colors duration-150 ${DARK_RUBEDO} ${DARK_RUBEDO_HOVER}`}
                  href={repo.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-lead">{repo.name}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 shrink-0 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span className="flex-1 text-body">{repo.description}</span>
                  {repo.updatedAt && (
                    <span className="mt-2 text-note tabular-nums">
                      {repo.stars > 0 &&
                        `${tRepos("stars", { count: repo.stars })} · `}
                      {tRepos("updated", {
                        when: format.relativeTime(
                          new Date(repo.updatedAt),
                          now
                        ),
                      })}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
