"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { DisplayRepo } from "@/lib/github";
import { CarouselControls } from "./carousel-controls";
import { RepoCard } from "./repo-card";

export function ReposCarousel({ repos }: { repos: readonly DisplayRepo[] }) {
  const t = useTranslations("Repos");
  const [api, setApi] = useState<CarouselApi>();

  return (
    <Carousel
      aria-label={t("carouselLabel")}
      className="w-full"
      opts={{ align: "start", containScroll: "trimSnaps" }}
      setApi={setApi}
    >
      <CarouselContent className="-ml-5 py-1">
        {repos.map((repo, index) => (
          <CarouselItem
            className="basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
            key={repo.name}
          >
            <RepoCard index={index} repo={repo} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselControls
        api={api}
        nextLabel={t("nextLabel")}
        prevLabel={t("prevLabel")}
      />
    </Carousel>
  );
}
