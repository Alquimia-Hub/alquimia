import { getTranslations } from "next-intl/server";
import { COMMUNITY_MEMBERS } from "@/lib/constants";
import { HeroCamera } from "./hero-camera";
import { AlquimiaLogo } from "./icons";
import { JoinLinks } from "./join-links";
import { HeroScene, Plate } from "./scene-picture";

export async function HeroSection() {
  const t = await getTranslations("Hero");
  const tCommon = await getTranslations("Common");

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
        {/* The symbol and the name the light settles into. */}
        <div
          aria-hidden="true"
          className="hero-mark pointer-events-none absolute inset-0 place-content-center justify-items-center gap-5 text-on-light"
          data-hero-mark
        >
          <AlquimiaLogo className="size-40 sm:size-56" />
          <p className="m-0 font-heading text-display">{tCommon("brand")}</p>
        </div>

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
            <p
              className="hero-rise mt-7 mb-0 text-ink-2 text-note"
              style={{ "--rise-delay": "620ms" } as React.CSSProperties}
            >
              {t("members", { count: COMMUNITY_MEMBERS })}
            </p>
          </div>
        </div>
      </div>
      <HeroCamera />
    </section>
  );
}
