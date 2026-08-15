"use client";

/**
 * Adapted from magicui / 21st.dev `hero-video-dialog`: a thumbnail card with a
 * play affordance that opens the video in an in-app modal. Rebuilt on Radix
 * Dialog (focus trap, escape, scroll lock) and restyled for the Alquimia look.
 */

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayGlyph } from "./icons";

export function HeroVideoDialog({
  videoSrc,
  thumbnailSrc,
  thumbnailAlt,
  title,
  children,
}: {
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  title: string;
  children: ReactNode;
}) {
  const t = useTranslations("Talks");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button
          className="talk-card group flex h-full w-full cursor-pointer flex-col border border-rule-2 bg-bg-2/80 p-0 text-left backdrop-blur-[3px]"
          type="button"
        >
          {/* Thumbnail */}
          <span className="relative block w-full overflow-hidden border-rule-2 border-b">
            <span className="relative block aspect-video w-full">
              <Image
                alt={thumbnailAlt}
                className="object-cover brightness-[0.78] saturate-[0.8] transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[0.92]"
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                src={thumbnailSrc}
              />
            </span>

            {/* Warm wash so the thumbnail sits inside the palette */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" />

            {/* Play affordance */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-[74px] w-[74px] scale-90 items-center justify-center rounded-full border border-gold/40 bg-bg/45 backdrop-blur-md transition-transform duration-300 ease-out group-hover:scale-100">
                <span className="play-core flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gold">
                  <PlayGlyph className="ml-[3px] h-5 w-5 text-primary-foreground" />
                </span>
              </span>
            </span>

            <span className="sr-only">{t("playLabel")}</span>
          </span>

          {children}
        </button>
      </DialogTrigger>

      <DialogContent
        className="w-[min(1100px,calc(100vw-2rem),calc((100dvh-8rem)*16/9))] max-w-none gap-0 rounded-none border-gold/30 bg-bg-2 p-0 shadow-[0_30px_120px_rgba(0,0,0,0.7)] sm:max-w-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <button
          aria-label={t("closeLabel")}
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center border border-rule bg-bg-2/80 text-ink-3 backdrop-blur-md transition-colors duration-200 hover:border-gold hover:text-gold"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          <span aria-hidden="true" className="text-[15px] leading-none">
            ✕
          </span>
        </button>

        <div className="aspect-video w-full bg-black">
          {isOpen && (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
              src={videoSrc}
              title={title}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
