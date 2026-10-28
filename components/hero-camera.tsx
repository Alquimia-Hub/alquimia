"use client";

import { useEffect, useRef } from "react";

// The walk through the archway, as shares of the hero's scroll (0 to 1). One
// thing happens at a time: the copy leaves, the camera approaches while the
// corridor lights up inside the arch, the arch opens past the screen, the
// corridor carries on towards the furnace, its light becomes the albedo
// field the next section starts on, and the symbol appears on it.
const COPY = [0, 0.1] as const;
const APPROACH = [0.08, 0.45] as const;
const REVEAL = [0.12, 0.3] as const;
const THROUGH = [0.45, 0.65] as const;
const HALL_OUT = [0.5, 0.62] as const;
const WALK = [0.62, 0.9] as const;
const BLOOM = [0.7, 0.92] as const;
const VEIL = [0.88, 0.93] as const;
const MARK = [0.9, 0.98] as const;

// How far each move goes. Phones show the tall scene, whose arch is wider.
const WIDE = { approach: 1.3, through: 1.5, open: 4.6, bloom: 6 };
const TALL = { approach: 1.15, through: 1.25, open: 3.4, bloom: 7 };
const TALL_MEDIA = "(max-aspect-ratio: 4/5)";

// Share of the remaining distance covered each frame: a flick still passes
// through every stage instead of jumping to the end.
const FOLLOW = 0.16;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const stretch = ([from, to]: readonly [number, number], progress: number) =>
  clamp((progress - from) / (to - from));
const easeIn = (t: number) => t * t;
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

/**
 * Scroll-driven camera for the hero: walks through the archway towards the
 * furnace light. The hero only gets its extra scroll length once this runs,
 * so without JavaScript or with reduced motion it stays one still screen.
 */
export function HeroCamera() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = anchor.current?.closest<HTMLElement>("[data-hero]");
    const find = (name: string) =>
      section?.querySelector<HTMLElement>(`[data-hero-${name}]`) ?? null;
    const camera = find("camera");
    const content = find("content");
    const scrim = find("scrim");
    const door = find("door");
    const view = find("door-view");
    const bloom = find("bloom");
    const veil = find("veil");
    const mark = find("mark");

    if (
      !(
        section &&
        camera &&
        content &&
        scrim &&
        door &&
        view &&
        bloom &&
        veil &&
        mark
      )
    ) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tall = window.matchMedia(TALL_MEDIA);
    const layers = [camera, content, scrim, door, view, bloom, veil, mark];
    let frame = 0;
    let shown = -1;

    const target = () => {
      const travel = section.offsetHeight - window.innerHeight;
      return travel > 0
        ? clamp(-section.getBoundingClientRect().top / travel)
        : 0;
    };

    // The copy leaves first, and stops taking clicks as soon as it starts.
    const paintCopy = (copy: number) => {
      content.style.opacity = String(1 - easeIn(copy));
      content.style.transform = `translate3d(0, ${copy * -24}px, 0)`;
      content.style.visibility = copy === 1 ? "hidden" : "";
      content.style.pointerEvents = copy > 0 ? "none" : "";
      scrim.style.opacity = String(1 - 0.65 * copy);
    };

    // The hall approaches the arch; then the arch opens past the edges of the
    // screen and the hall goes with it, so the painted arch stays on the edge
    // of the opening while the hall fades.
    const paintHall = (opening: number, hallOut: number) => {
      camera.style.transform = `scale(${opening})`;
      camera.style.opacity = String(1 - hallOut);
      camera.style.visibility = hallOut === 1 ? "hidden" : "";
    };

    // The corridor keeps its own size inside the doorway and walks forward.
    // Once through, the arch mask is dropped and the door stops scaling, so no
    // oversized masked layer stays alive.
    const paintDoor = (
      reveal: number,
      opening: number,
      corridor: number,
      inside: boolean
    ) => {
      door.style.opacity = String(reveal);
      door.style.transform = inside ? "none" : `scale(${opening})`;
      door.style.maskImage = inside ? "none" : "";
      view.style.transform = `scale(${inside ? corridor : corridor / opening})`;
    };

    // A soft glow that keeps growing; the veil settles it on flat albedo.
    const paintLight = (glow: number, spread: number, settle: number) => {
      bloom.style.opacity = String(Math.min(1, glow * 3));
      bloom.style.transform = `scale(${0.04 + spread * easeIn(glow)})`;
      veil.style.opacity = String(easeIn(settle));
    };

    // The symbol rises out of the settled light.
    const paintMark = (appear: number) => {
      const eased = easeInOut(appear);
      mark.style.opacity = String(eased);
      mark.style.transform = `scale(${0.9 + 0.1 * eased})`;
    };

    const paint = (progress: number) => {
      const reach = tall.matches ? TALL : WIDE;
      const approach = easeInOut(stretch(APPROACH, progress));
      const through = easeIn(stretch(THROUGH, progress));
      const walk = easeInOut(stretch(WALK, progress));
      const hall =
        1 +
        (reach.approach - 1) * approach +
        (reach.through - reach.approach) * through;
      const opening = hall * (1 + (reach.open - 1) * through);

      paintCopy(stretch(COPY, progress));
      paintHall(opening, stretch(HALL_OUT, progress));
      paintDoor(
        stretch(REVEAL, progress),
        opening,
        1 + 0.06 * through + 0.16 * walk,
        through === 1
      );
      paintLight(
        stretch(BLOOM, progress),
        reach.bloom,
        stretch(VEIL, progress)
      );
      paintMark(stretch(MARK, progress));
    };

    const tick = () => {
      frame = 0;
      const goal = target();
      const next =
        shown < 0 || Math.abs(goal - shown) < 0.0005
          ? goal
          : shown + (goal - shown) * FOLLOW;
      shown = next;
      paint(next);
      if (next !== goal) {
        frame = requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      shown = -1;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      delete section.dataset.camera;
      for (const element of layers) {
        element.removeAttribute("style");
      }
    };

    const start = () => {
      section.dataset.camera = "on";
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      tick();
    };

    const sync = () => {
      stop();
      if (!reduced.matches) {
        start();
      }
    };

    sync();
    reduced.addEventListener("change", sync);
    tall.addEventListener("change", schedule);

    return () => {
      reduced.removeEventListener("change", sync);
      tall.removeEventListener("change", schedule);
      stop();
    };
  }, []);

  return <span hidden ref={anchor} />;
}
