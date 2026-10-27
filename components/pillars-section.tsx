import { useTranslations } from "next-intl";
import { PILLAR_IDS } from "@/lib/constants";
import { revealIndex } from "@/lib/reveal";
import { TALKS, talkEmbedUrl, talkThumbnailUrl } from "@/lib/talks";
import { Glyph, type GlyphName } from "./glyphs";
import { HeroVideoDialog } from "./hero-video-dialog";
import { ScrollReveal } from "./scroll-reveal";

const PILLAR_GLYPHS: Record<(typeof PILLAR_IDS)[number], GlyphName> = {
  inteligencia: "mercury",
  automatizacion: "fire",
  productividad: "salt",
};

// Topics the community actually debated, confirmed by the team (copy.md).
const RECENT_TOPICS = ["cloud", "peptides", "taste", "automation"] as const;

/** "De qué hablamos": the three pillars, what came up lately and the talks. */
export function PillarsSection() {
  const t = useTranslations("Topics");
  const tPillars = useTranslations("Pillars");
  const tTalks = useTranslations("Talks");
  // The copy names the one recorded talk; more talks need their own sentence.
  const [talk] = TALKS;
  const talkTitle = tTalks(`items.${talk.id}.title`);

  return (
    <section aria-labelledby="temas-title" className="bg-bg text-ink">
      <ScrollReveal className="section-frame">
        <h2
          className="m-0 font-heading font-normal text-title"
          data-reveal-item
          id="temas-title"
          style={revealIndex(0)}
        >
          {t("title")}
        </h2>

        <dl className="m-0 mt-14 grid grid-cols-1 gap-x-10 gap-y-12 max-md:mt-10 md:grid-cols-3">
          {PILLAR_IDS.map((pillar, index) => (
            <div
              className="flex flex-col"
              data-reveal-item
              key={pillar}
              style={revealIndex(index + 1)}
            >
              <Glyph
                className="size-12 text-gold"
                name={PILLAR_GLYPHS[pillar]}
              />
              <dt className="mt-6 font-semibold text-lead">
                {tPillars(`${pillar}.title`)}
              </dt>
              <dd className="m-0 mt-2 max-w-[32ch] text-body text-ink-2">
                {tPillars(`${pillar}.description`)}
              </dd>
            </div>
          ))}
        </dl>

        <div
          className="mt-[clamp(4rem,7vw,6rem)] grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12"
          data-reveal-item
          style={revealIndex(4)}
        >
          <h3 className="m-0 font-semibold text-lead md:col-span-4 md:pt-5">
            {t("recentTitle")}
          </h3>
          <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 md:col-span-8">
            {RECENT_TOPICS.map((topic) => (
              <li className="bg-bg-2 px-6 py-5 text-lead" key={topic}>
                {t(`recent.${topic}`)}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-[clamp(4rem,7vw,6rem)] grid scroll-mt-8 grid-cols-1 items-center gap-x-6 gap-y-6 lg:grid-cols-12"
          id="charlas"
        >
          <div
            className="lg:col-span-7"
            data-reveal-item
            style={revealIndex(0)}
          >
            <HeroVideoDialog
              thumbnailAlt={tTalks("thumbnailAlt", { title: talkTitle })}
              thumbnailSrc={talkThumbnailUrl(talk.youtubeId)}
              title={talkTitle}
              videoSrc={talkEmbedUrl(talk)}
            />
          </div>
          <p
            className="m-0 text-lead lg:col-span-4 lg:col-start-9"
            data-reveal-item
            style={revealIndex(1)}
          >
            {t.rich("talk", {
              title: (chunks) => <cite className="italic">{chunks}</cite>,
            })}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
