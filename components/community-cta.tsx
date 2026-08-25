"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { COMMUNITY_LINKS } from "@/lib/constants";
import { DiscordIcon, WhatsAppIcon } from "./icons";

const PARTICLE_COUNT = 18;

const BUTTON_BASE =
  "inline-flex h-auto cursor-pointer items-center justify-center gap-4.5 border py-5 font-[family-name:var(--font-im-fell)] text-[13px] uppercase tracking-[0.3em] max-md:w-full max-md:px-6";

function spawnParticles(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement("span");
    particle.className = "cta-particle";

    const angle =
      (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.4;
    const distance = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 30 - Math.random() * 40;
    const size = 3 + Math.random() * 4;
    const delay = Math.random() * 120;

    particle.style.cssText = `
      left: ${centerX}px;
      top: ${centerY}px;
      width: ${size}px;
      height: ${size}px;
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation-delay: ${delay}ms;
    `;

    container.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), {
      once: true,
    });
  }
}

function useParticleBurst() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      return;
    }

    spawnParticles(wrapperRef.current);
  }, []);

  return { wrapperRef, handleClick };
}

export function CommunityCta() {
  const t = useTranslations("Cta");
  const discord = useParticleBurst();
  const whatsapp = useParticleBurst();

  return (
    <div
      className="flex animate-entrance animate-fade-up flex-col items-center"
      style={{ "--delay": "750ms" } as React.CSSProperties}
    >
      <div className="flex items-center justify-center gap-5 max-md:w-full max-md:max-w-[340px] max-md:flex-col max-md:gap-3.5">
        <div className="relative max-md:w-full" ref={discord.wrapperRef}>
          <Button
            asChild
            className={`btn-discord cta-idle ${BUTTON_BASE} border-gold bg-gold px-11 text-primary-foreground`}
            onClick={discord.handleClick}
          >
            <a
              href={COMMUNITY_LINKS.discord}
              rel="noopener noreferrer"
              target="_blank"
            >
              <DiscordIcon className="h-[18px] w-[18px]" />
              <span>{t("button")}</span>
              <span className="font-serif text-[20px] italic tracking-normal">
                ⟶
              </span>
            </a>
          </Button>
        </div>

        <div className="relative max-md:w-full" ref={whatsapp.wrapperRef}>
          <Button
            asChild
            className={`btn-whatsapp ${BUTTON_BASE} border-gold/40 bg-transparent px-9 text-ink-2 hover:bg-transparent`}
            onClick={whatsapp.handleClick}
          >
            <a
              href={COMMUNITY_LINKS.whatsapp}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              <span>{t("whatsappButton")}</span>
            </a>
          </Button>
        </div>
      </div>

      <p className="mt-4.5 font-[family-name:var(--font-eb-garamond)] text-[13px] text-ink-3 italic">
        <span className="mx-2.5 inline-block h-[3px] w-[3px] rotate-45 bg-gold align-middle" />
        {t("note")}
        <span className="mx-2.5 inline-block h-[3px] w-[3px] rotate-45 bg-gold align-middle" />
      </p>
    </div>
  );
}
