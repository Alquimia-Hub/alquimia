"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
}: {
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  title: string;
}) {
  const t = useTranslations("Talks");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button
          aria-label={`${t("playLabel")}: ${title}`}
          className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-on-light"
          type="button"
        >
          <Image
            alt={thumbnailAlt}
            className="object-cover contrast-[1.05] grayscale sepia-[0.45] transition-[transform,filter] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:sepia-[0.25]"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            src={thumbnailSrc}
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-bg text-ink transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:scale-105 group-active:scale-95 max-sm:size-16">
              <PlayGlyph className="ml-1 size-7" />
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        className="w-[min(1100px,calc(100vw-2rem),calc((100dvh-8rem)*16/9))] max-w-none gap-0 rounded-none border-0 bg-bg-2 p-0 sm:max-w-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

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

        <button
          aria-label={t("closeLabel")}
          className="absolute -top-14 right-0 flex size-12 cursor-pointer items-center justify-center bg-albedo text-on-light transition-colors duration-150 hover:bg-gold"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          <X aria-hidden="true" className="size-6" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
