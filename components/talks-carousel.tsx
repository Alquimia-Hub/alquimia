"use client";

import { useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SITE_CONTENT } from "@/lib/constants";
import { TALKS, type Talk, talkEmbedUrl, talkThumbnailUrl } from "@/lib/talks";
import { CarouselControls } from "./carousel-controls";
import { HeroVideoDialog } from "./hero-video-dialog";
import { AlquimiaDivider, DiscordIcon } from "./icons";

function TalkCardBody({ talk }: { talk: Talk }) {
  return (
    <span className="flex flex-1 flex-col p-7 max-md:p-6">
      <span className="flex items-center gap-2.5 font-[family-name:var(--font-im-fell)] text-[9px] text-ink-3 uppercase tracking-[0.28em]">
        <span className="h-[3px] w-[3px] rotate-45 bg-gold" />
        {talk.date}
      </span>

      <span className="mt-3.5 block font-[family-name:var(--font-cormorant)] font-normal text-[1.6rem] text-ink leading-[1.15] tracking-[-0.01em] transition-colors duration-300 group-hover:text-gold">
        {talk.title}
      </span>

      <span className="mt-2.5 block font-[family-name:var(--font-eb-garamond)] text-[15px] text-ink-3 italic leading-[1.5]">
        {talk.description}
      </span>

      <span className="mt-auto flex flex-col gap-1.5 border-rule-2 border-t pt-5 font-[family-name:var(--font-im-fell)] text-[9px] uppercase tracking-[0.24em] max-md:pt-4">
        <span className="text-ink-2">{talk.speakers}</span>
        <span className="text-ink-4">{talk.event}</span>
      </span>
    </span>
  );
}

function ComingSoonCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 border border-rule-2 border-dashed bg-bg-2/30 p-10 text-center max-md:p-8">
      <AlquimiaDivider className="h-9 w-9 text-gold opacity-60" />

      <h3 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-[1.6rem] text-ink-2 italic leading-[1.15]">
        {SITE_CONTENT.talks.soon.title}
      </h3>

      <p className="m-0 max-w-[300px] font-[family-name:var(--font-eb-garamond)] text-[15px] text-ink-3 italic leading-[1.5]">
        {SITE_CONTENT.talks.soon.description}
      </p>

      <a
        className="mt-1 inline-flex items-center gap-3 border border-gold/30 px-6 py-3.5 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-2 uppercase tracking-[0.28em] transition-colors duration-300 hover:border-gold hover:text-gold"
        href={SITE_CONTENT.cta.discordUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <DiscordIcon className="h-4 w-4" />
        {SITE_CONTENT.talks.soon.cta}
      </a>
    </div>
  );
}

export function TalksCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <Carousel
      aria-label="Charlas de Alquimia"
      className="w-full"
      opts={{ align: "start", containScroll: "trimSnaps" }}
      setApi={setApi}
    >
      <CarouselContent className="-ml-5 py-1">
        {TALKS.map((talk) => (
          <CarouselItem className="basis-full pl-5 md:basis-1/2" key={talk.id}>
            <HeroVideoDialog
              thumbnailAlt={`Miniatura de la charla: ${talk.title}`}
              thumbnailSrc={talkThumbnailUrl(talk.youtubeId)}
              title={talk.title}
              videoSrc={talkEmbedUrl(talk)}
            >
              <TalkCardBody talk={talk} />
            </HeroVideoDialog>
          </CarouselItem>
        ))}

        <CarouselItem className="basis-full pl-5 md:basis-1/2">
          <ComingSoonCard />
        </CarouselItem>
      </CarouselContent>

      <CarouselControls
        api={api}
        nextLabel="Siguientes charlas"
        prevLabel="Charlas anteriores"
      />
    </Carousel>
  );
}
