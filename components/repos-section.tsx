import { Button } from "@/components/ui/button";
import { SITE_CONTENT, SOCIAL_LINKS } from "@/lib/constants";
import { fetchOrgRepos } from "@/lib/github";
import { GithubIcon } from "./icons";
import { ReposCarousel } from "./repos-carousel";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeading } from "./section-heading";

export async function ReposSection() {
  const repos = await fetchOrgRepos();

  return (
    <section
      className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-14 py-24 max-md:px-5 max-md:py-16 max-lg:px-8"
      id="repos"
    >
      <SectionHeading
        eyebrow={SITE_CONTENT.repos.eyebrow}
        subtitle={SITE_CONTENT.repos.subtitle}
        title={SITE_CONTENT.repos.title}
      />

      <ScrollReveal className="mt-14 max-md:mt-10">
        <ReposCarousel repos={repos} />
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
            <span>{SITE_CONTENT.repos.cta}</span>
            <span className="font-serif text-[18px] italic tracking-normal">
              ⟶
            </span>
          </a>
        </Button>
      </ScrollReveal>
    </section>
  );
}
