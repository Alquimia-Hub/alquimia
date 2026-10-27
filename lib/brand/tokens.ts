export type ColorTokenName = "nigredo" | "albedo" | "citrinitas" | "rubedo";

export interface ColorToken {
  /** Contrast of `textHex` over `hex`, WCAG 2.x. */
  contrastRatio: number;
  cssVar: string;
  hex: string;
  name: ColorTokenName;
  /** Proper name of the stage, the same in every locale. */
  stage: string;
  /** Text colour that goes on top of this colour. */
  textHex: string;
}

export const COLOR_TOKENS: ColorToken[] = [
  {
    name: "nigredo",
    stage: "Nigredo",
    cssVar: "--bg",
    hex: "#14110d",
    textHex: "#ede6d6",
    contrastRatio: 15.14,
  },
  {
    name: "albedo",
    stage: "Albedo",
    cssVar: "--albedo",
    hex: "#ede6d6",
    textHex: "#1e1912",
    contrastRatio: 14.04,
  },
  {
    name: "citrinitas",
    stage: "Citrinitas",
    cssVar: "--gold",
    hex: "#e0ae45",
    textHex: "#14110d",
    contrastRatio: 9.24,
  },
  {
    name: "rubedo",
    stage: "Rubedo",
    cssVar: "--rubedo",
    hex: "#7e2618",
    textHex: "#ede6d6",
    contrastRatio: 7.76,
  },
];

export const FONT = {
  name: "Literata",
  cssVar: "--font-literata",
  googleHref: "https://fonts.google.com/specimen/Literata",
} as const;

export type TypeStepName = "display" | "title" | "lead" | "body" | "note";

export interface TypeStep {
  className: string;
  name: TypeStepName;
  size: string;
}

/** The five steps defined in app/globals.css (`--text-*`). */
export const TYPE_STEPS: TypeStep[] = [
  {
    name: "display",
    size: "44–96 px",
    className: "text-display font-medium",
  },
  { name: "title", size: "32–52 px", className: "text-title font-medium" },
  { name: "lead", size: "20–26 px", className: "text-lead" },
  { name: "body", size: "18–21 px", className: "text-body" },
  { name: "note", size: "14 px", className: "text-note" },
];

export type LogoVariantId = "icon" | "horizontal" | "stacked" | "wordmark";

export interface LogoVariant {
  height: number;
  id: LogoVariantId;
  svgPath: string;
  width: number;
}

export const LOGO_VARIANTS: LogoVariant[] = [
  { id: "icon", svgPath: "/brand/alquimia-icon.svg", width: 40, height: 40 },
  {
    id: "horizontal",
    svgPath: "/brand/alquimia-horizontal.svg",
    width: 914.42,
    height: 109.2,
  },
  {
    id: "stacked",
    svgPath: "/brand/alquimia-stacked.svg",
    width: 794.05,
    height: 279.13,
  },
  {
    id: "wordmark",
    svgPath: "/brand/alquimia-wordmark.svg",
    width: 794.05,
    height: 98.58,
  },
];

export const PNG_SIZES = [512, 1024, 2048] as const;
export type PngSize = (typeof PNG_SIZES)[number];

export const PNG_COLORS = {
  light: "#ede6d6",
  dark: "#14110d",
} as const;
export type PngColorKey = keyof typeof PNG_COLORS;
