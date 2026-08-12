"use client";

import { useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Repo } from "@/lib/github";
import { CarouselControls } from "./carousel-controls";
import { RepoCard } from "./repo-card";

export function ReposCarousel({ repos }: { repos: readonly Repo[] }) {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <Carousel
      aria-label="Repositorios de Alquimia"
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
        nextLabel="Siguientes repositorios"
        prevLabel="Repositorios anteriores"
      />
    </Carousel>
  );
}
