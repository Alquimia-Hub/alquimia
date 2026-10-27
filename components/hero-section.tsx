import { getTranslations } from "next-intl/server";
import { fetchOrgRepos, isCuratedRepo } from "@/lib/github";
import { countApprovedProjects } from "@/lib/launchpad/queries";
import { HeroCamera } from "./hero-camera";
import { JoinLinks } from "./join-links";
import { HeroScene, Plate } from "./scene-picture";

async function countProof() {
  const [projects, repos] = await Promise.all([
    countApprovedProjects().catch(() => 0),
    fetchOrgRepos(),
  ]);
  // Without GitHub the curated list comes back as a fallback with no dates:
  // the number would be ours, not GitHub's, so it is left out.
  const live = repos.filter(
    (repo) => isCuratedRepo(repo.name) && repo.updatedAt
  );
  return { projects, repos: live.length };
}

export async function HeroSection() {
  const [t, proof] = await Promise.all([getTranslations("Hero"), countProof()]);
  const facts = [
    proof.projects > 0 && t("proofProjects", { count: proof.projects }),
    proof.repos > 0 && t("proofRepos", { count: proof.repos }),
  ].filter(Boolean);

  return (
    <section
      aria-labelledby="hero-title"
      className="hero relative bg-bg"
      data-hero
      id="taller"
    >
      <div className="sticky top-0 h-svh min-h-[34rem] overflow-hidden">
        <div className="hero-camera absolute inset-0" data-hero-camera>
          <HeroScene alt={t("imageAlt")} className="hero-settle" />
        </div>
        {/* The corridor behind the archway, seen only through the arch. It
            stays out of the page until the camera runs. */}
        <div
          aria-hidden="true"
          className="hero-door pointer-events-none absolute inset-0"
          data-hero-door
        >
          <div className="hero-door-view absolute inset-0" data-hero-door-view>
            <Plate
              alt=""
              className="size-full"
              name="umbral"
              position="50% 60%"
              sizes="100vw"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="hero-scrim pointer-events-none absolute inset-0"
          data-hero-scrim
        />
        {/* The furnace light that becomes the albedo of the next section. */}
        <div
          aria-hidden="true"
          className="hero-bloom pointer-events-none absolute inset-0"
          data-hero-bloom
        />
        <div
          aria-hidden="true"
          className="hero-veil pointer-events-none absolute inset-0 bg-albedo"
          data-hero-veil
        />

        <div
          className="pointer-events-none relative grid h-full place-items-center px-[var(--gutter)] pt-20 pb-[8svh] text-center"
          data-hero-content
        >
          <div className="pointer-events-auto flex max-w-[44rem] flex-col items-center">
            <h1
              className="hero-title-rise m-0 max-w-[12ch] text-balance font-heading font-normal text-display text-ink"
              id="hero-title"
            >
              {t("title")}
            </h1>
            <p
              className="hero-rise mt-6 mb-0 max-w-[34ch] text-body text-ink max-sm:max-w-[28ch]"
              style={{ "--rise-delay": "200ms" } as React.CSSProperties}
            >
              {t("subtitle")}
            </p>
            <JoinLinks className="hero-rise mt-9 justify-center max-sm:w-full max-sm:max-w-80" />
            {facts.length > 0 && (
              <p
                className="hero-rise mt-7 mb-0 text-ink-2 text-note"
                style={{ "--rise-delay": "620ms" } as React.CSSProperties}
              >
                {facts.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>
      <HeroCamera />
    </section>
  );
}
