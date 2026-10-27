import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { COMMUNITY_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { revealIndex } from "@/lib/reveal";
import { Glyph, type GlyphName } from "./glyphs";
import { DiscordIcon, WhatsappIcon } from "./icons";
import { Plate, type PlateName } from "./scene-picture";
import { ScrollReveal } from "./scroll-reveal";

const STAGES: readonly {
  id: "nigredo" | "albedo" | "citrinitas" | "rubedo";
  glyph: GlyphName;
  plate: PlateName;
  /** `object-position` for the plate inside the arch. */
  position?: string;
  /** Null for the first stage, which opens both ways into the group. */
  href: string | null;
  external: boolean;
}[] = [
  {
    id: "nigredo",
    glyph: "saturn",
    plate: "stage-nigredo",
    // Keeps the raven clear of the curve of the arch.
    position: "50% 32%",
    href: null,
    external: true,
  },
  {
    id: "albedo",
    glyph: "moon",
    plate: "stage-albedo",
    href: SOCIAL_LINKS.youtube,
    external: true,
  },
  {
    id: "citrinitas",
    glyph: "sun",
    plate: "stage-citrinitas",
    href: "/#laboratorio",
    external: false,
  },
  {
    id: "rubedo",
    glyph: "stone",
    plate: "stage-rubedo",
    // Keeps the phoenix's crest and wing tips inside the arch.
    position: "50% 30%",
    href: "/launchpad/new",
    external: false,
  },
];

const ACTION =
  "stage-action inline-flex min-h-12 items-center gap-2.5 self-start whitespace-nowrap px-5 font-semibold text-body max-sm:self-stretch max-sm:justify-center";

const CHANNEL =
  "inline-flex min-h-12 items-center justify-center gap-2.5 whitespace-nowrap bg-bg-3 px-4 font-semibold text-body text-ink transition-colors duration-150 hover:bg-surface-active active:translate-y-px";

/**
 * "Entrar al grupo" opens the two equal ways in. A native disclosure: it
 * works without JavaScript and from the keyboard.
 */
function GroupChooser({ label }: { label: string }) {
  const t = useTranslations("Footer");

  return (
    <details className="group/join self-start max-sm:self-stretch">
      <summary
        className={`${ACTION} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className="size-5 transition-transform duration-200 ease-[var(--ease-out-expo)] group-open/join:rotate-180"
        />
      </summary>
      <div className="join-options mt-2 grid grid-cols-2 gap-2">
        <a
          className={CHANNEL}
          href={COMMUNITY_LINKS.discord}
          rel="noopener noreferrer"
          target="_blank"
        >
          <DiscordIcon className="size-5" />
          {t("discord")}
        </a>
        <a
          className={CHANNEL}
          href={COMMUNITY_LINKS.whatsapp}
          rel="noopener noreferrer"
          target="_blank"
        >
          <WhatsappIcon className="size-5" />
          {t("whatsapp")}
        </a>
      </div>
    </details>
  );
}

/**
 * "¿Por dónde arrancás?": the four stages of the Great Work as the four
 * panels of a polyptych, from the darkest to the red, each with its first
 * step. Everything is visible at once; there is nothing to pick.
 */
export function WelcomeSection() {
  const t = useTranslations("Welcome");

  return (
    <section
      aria-labelledby="bienvenida-title"
      className="bg-albedo text-on-light"
      id="bienvenida"
    >
      <ScrollReveal className="section-frame pt-[clamp(3rem,5vw,4.5rem)] pb-[clamp(2.5rem,4vw,3.5rem)]">
        <div className="grid grid-cols-1 items-end gap-x-6 gap-y-4 md:grid-cols-12">
          <h2
            className="m-0 font-heading font-normal text-title md:col-span-7"
            data-reveal-item
            id="bienvenida-title"
            style={revealIndex(0)}
          >
            {t("title")}
          </h2>
          <p
            className="m-0 text-lead md:col-span-5 md:pb-1"
            data-reveal-item
            style={revealIndex(1)}
          >
            {t("text")}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal
        as="div"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
      >
        {STAGES.map((stage, index) => {
          const name = t(`stages.${stage.id}.name`);
          const label = t(`stages.${stage.id}.link`);

          return (
            <article
              aria-labelledby={`etapa-${stage.id}`}
              className="stage-panel group flex flex-col gap-6 px-[clamp(1.25rem,2.4vw,2.25rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(2rem,3.5vw,3rem)]"
              data-reveal-item
              data-stage={stage.id}
              key={stage.id}
              style={revealIndex(index)}
            >
              <figure className="m-0 flex flex-col gap-4">
                <div className="aspect-[4/5] overflow-hidden rounded-t-[999px]">
                  <Plate
                    alt=""
                    className="stage-plate size-full"
                    name={stage.plate}
                    position={stage.position}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <figcaption className="flex items-center gap-2.5 text-note">
                  <Glyph className="size-5" name={stage.glyph} />
                  {name}
                </figcaption>
              </figure>

              <div className="flex flex-1 flex-col gap-3">
                <h3
                  className="m-0 font-semibold text-lead leading-tight"
                  id={`etapa-${stage.id}`}
                >
                  {t(`stages.${stage.id}.option`)}
                </h3>
                <p className="m-0 max-w-[34ch] text-body">
                  {t(`stages.${stage.id}.text`)}
                </p>
              </div>

              {stage.href === null && <GroupChooser label={label} />}
              {stage.href !== null && stage.external && (
                <a
                  className={ACTION}
                  href={stage.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {label}
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </a>
              )}
              {stage.href !== null && !stage.external && (
                <Link className={ACTION} href={stage.href}>
                  {label}
                  <ArrowRight aria-hidden="true" className="size-5" />
                </Link>
              )}
            </article>
          );
        })}
      </ScrollReveal>
    </section>
  );
}
