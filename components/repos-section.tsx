import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/lib/constants";
import {
  type DisplayRepo,
  fetchOrgRepos,
  isCuratedRepo,
  type Repo,
} from "@/lib/github";
import { GithubIcon } from "./icons";
import { ReposCarousel } from "./repos-carousel";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeading } from "./section-heading";

type ReposTranslator = Awaited<ReturnType<typeof getTranslations<"Repos">>>;

function splitTopics(value: string): string[] {
  return value.split(",").map((topic) => topic.trim());
}

function localizeRepo(repo: Repo, t: ReposTranslator): DisplayRepo {
  if (!isCuratedRepo(repo.name)) {
    return { ...repo, description: repo.description ?? t("emptyLabel") };
  }

  const topics =
    repo.topics.length > 0
      ? repo.topics
      : splitTopics(t(`topics.${repo.name}`));

  return { ...repo, description: t(`descriptions.${repo.name}`), topics };
}

export async function ReposSection() {
  const [repos, t] = await Promise.all([
    fetchOrgRepos(),
    getTranslations("Repos"),
  ]);

  const localizedRepos = repos.map((repo) => localizeRepo(repo, t));

  return (
    <section
      className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-14 py-24 max-md:px-5 max-md:py-16 max-lg:px-8"
      id="repos"
    >
      <SectionHeading
        eyebrow={t("eyebrow")}
        subtitle={t("subtitle")}
        title={t("title")}
      />

      <ScrollReveal className="mt-14 max-md:mt-10">
        <ReposCarousel repos={localizedRepos} />
      </ScrollReveal>

      <ScrollReveal className="mt-12 flex justify-center max-md:mt-10">
        <Button
          asChild
          className="btn-whatsapp inline-flex h-auto cursor-pointer items-center justify-center gap-4 border border-gold/40 bg-transparent px-9 py-5 font-[family-name:var(--font-im-fell)] text-[12px] text-ink-2 uppercase tracking-[0.3em] hover:bg-transparent max-md:w-full max-md:gap-3 max-md:px-4 max-md:text-[10px] max-md:tracking-[0.18em]"
        >
          <a
            href={SOCIAL_LINKS.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="h-[17px] w-[17px]" />
            <span>{t("cta")}</span>
            <span className="font-serif text-[18px] italic tracking-normal">
              ⟶
            </span>
          </a>
        </Button>
      </ScrollReveal>
    </section>
  );
}
