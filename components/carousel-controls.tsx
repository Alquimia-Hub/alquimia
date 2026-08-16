"use client";

import { useCallback, useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

interface CarouselState {
  canScrollNext: boolean;
  canScrollPrev: boolean;
  selectedIndex: number;
  snapCount: number;
}

const INITIAL_STATE: CarouselState = {
  selectedIndex: 0,
  snapCount: 0,
  canScrollPrev: false,
  canScrollNext: false,
};

function useCarouselState(api: CarouselApi): CarouselState {
  const [state, setState] = useState<CarouselState>(INITIAL_STATE);

  useEffect(() => {
    if (!api) {
      return;
    }

    const sync = () => {
      setState({
        selectedIndex: api.selectedScrollSnap(),
        snapCount: api.scrollSnapList().length,
        canScrollPrev: api.canScrollPrev(),
        canScrollNext: api.canScrollNext(),
      });
    };

    sync();
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return state;
}

function padIndex(value: number): string {
  return String(value).padStart(2, "0");
}

export function CarouselControls({
  api,
  prevLabel,
  nextLabel,
}: {
  api: CarouselApi;
  prevLabel: string;
  nextLabel: string;
}) {
  const { selectedIndex, snapCount, canScrollPrev, canScrollNext } =
    useCarouselState(api);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  if (snapCount <= 1) {
    return null;
  }

  return (
    <div className="mt-9 flex items-center justify-center gap-6">
      <button
        aria-label={prevLabel}
        className="carousel-arrow"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        type="button"
      >
        <span aria-hidden="true">⟵</span>
      </button>

      <div className="flex items-center gap-2.5 font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-3 tabular-nums tracking-[0.2em]">
        <span className="text-gold">{padIndex(selectedIndex + 1)}</span>
        <span className="h-px w-6 bg-rule" />
        <span>{padIndex(snapCount)}</span>
      </div>

      <button
        aria-label={nextLabel}
        className="carousel-arrow"
        disabled={!canScrollNext}
        onClick={scrollNext}
        type="button"
      >
        <span aria-hidden="true">⟶</span>
      </button>
    </div>
  );
}
