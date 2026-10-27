import type { CSSProperties } from "react";

/** Stagger position of a `data-reveal-item` inside a `ScrollReveal`. */
export const revealIndex = (i: number) => ({ "--i": i }) as CSSProperties;
