import { cn } from "@/lib/utils";

/**
 * The alchemical glyphs that work as the site's icons. Each one names a stage
 * of the Great Work or a pillar, drawn by hand on a 24 × 24 box with one
 * stroke weight so they sit together and with the type.
 */
const GLYPHS = {
  // ♄ Saturn, lead: nigredo.
  saturn: (
    <path d="M6 6.5h7M9.5 3v11.5m0-3c1.6-2.4 6.5-2.6 6.5 1.4 0 2.8-3 3.8-3 6.3 0 1.4 1.4 2.2 3 1.5" />
  ),
  // ☽ Moon, silver: albedo.
  moon: <path d="M15 3.5a8.5 8.5 0 1 0 0 17 10 10 0 0 1 0-17z" />,
  // ☉ Sun, gold: citrinitas.
  sun: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" fill="currentColor" r="1.6" stroke="none" />
    </>
  ),
  // The squared circle, the philosopher's stone: rubedo.
  stone: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 2.75 20 16.6H4z" />
      <path d="M8.3 9.2h7.4v7.4H8.3z" />
      <circle cx="12" cy="12.9" r="2.2" />
    </>
  ),
  // ☿ Mercury: intelligence.
  mercury: (
    <>
      <path d="M8.5 2.75a3.5 3.5 0 0 0 7 0" />
      <circle cx="12" cy="10" r="4" />
      <path d="M12 14v7.5M9 18h6" />
    </>
  ),
  // △ Fire, what transforms by itself: automation.
  fire: <path d="M12 3.5 20.5 19.5h-17z" />,
  // 🜔 Salt, what fixes and keeps: productivity.
  salt: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
    </>
  ),
} as const;

export type GlyphName = keyof typeof GLYPHS;

export function Glyph({
  name,
  label,
  className,
}: {
  name: GlyphName;
  /** Accessible name, only when the glyph stands without its text. */
  label?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("size-6 shrink-0", className)}
      fill="none"
      role={label ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      {GLYPHS[name]}
    </svg>
  );
}
