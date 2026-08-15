export type ContrastGrade = "AAA" | "AA" | "AA-Large" | "FAIL";

/** Token names double as message keys under `Brand.colorNotes`. */
export const COLOR_TOKEN_NAMES = [
  "bg",
  "bg-2",
  "bg-3",
  "ink",
  "ink-2",
  "ink-3",
  "ink-4",
  "gold",
  "gold-2",
  "copper",
] as const;

export type ColorTokenName = (typeof COLOR_TOKEN_NAMES)[number];

export interface ColorToken {
  contrast: ContrastGrade;
  contrastRatio: number;
  cssVar: string;
  decorative?: boolean;
  group: "backgrounds" | "ink" | "accents";
  hex: string;
  name: ColorTokenName;
}

export const COLOR_TOKENS: ColorToken[] = [
  {
    name: "bg",
    cssVar: "--bg",
    hex: "#0a0806",
    group: "backgrounds",
    contrast: "AAA",
    contrastRatio: 14.39,
  },
  {
    name: "bg-2",
    cssVar: "--bg-2",
    hex: "#120e09",
    group: "backgrounds",
    contrast: "AAA",
    contrastRatio: 13.84,
  },
  {
    name: "bg-3",
    cssVar: "--bg-3",
    hex: "#1e170f",
    group: "backgrounds",
    contrast: "AAA",
    contrastRatio: 12.76,
  },
  {
    name: "ink",
    cssVar: "--ink",
    hex: "#ead9b8",
    group: "ink",
    contrast: "AAA",
    contrastRatio: 14.39,
  },
  {
    name: "ink-2",
    cssVar: "--ink-2",
    hex: "#c9b689",
    group: "ink",
    contrast: "AAA",
    contrastRatio: 10.03,
  },
  {
    name: "ink-3",
    cssVar: "--ink-3",
    hex: "#9d8b6a",
    group: "ink",
    contrast: "AA",
    contrastRatio: 6.03,
  },
  {
    name: "ink-4",
    cssVar: "--ink-4",
    hex: "#4a4230",
    group: "ink",
    contrast: "FAIL",
    contrastRatio: 2.01,
    decorative: true,
  },
  {
    name: "gold",
    cssVar: "--gold",
    hex: "#d99a3d",
    group: "accents",
    contrast: "AAA",
    contrastRatio: 8.23,
  },
  {
    name: "gold-2",
    cssVar: "--gold-2",
    hex: "#f0b956",
    group: "accents",
    contrast: "AAA",
    contrastRatio: 11.22,
  },
  {
    name: "copper",
    cssVar: "--copper",
    hex: "#b86a2a",
    group: "accents",
    contrast: "AA",
    contrastRatio: 4.89,
  },
];

export interface FontToken {
  cssVar: string;
  googleHref: string;
  name: string;
  role: "display" | "body" | "ornament" | "mono";
  sampleWeight?: number;
}

export const FONT_TOKENS: FontToken[] = [
  {
    name: "Cormorant Garamond",
    cssVar: "--font-cormorant",
    role: "display",
    googleHref: "https://fonts.google.com/specimen/Cormorant+Garamond",
  },
  {
    name: "EB Garamond",
    cssVar: "--font-eb-garamond",
    role: "body",
    googleHref: "https://fonts.google.com/specimen/EB+Garamond",
  },
  {
    name: "IM Fell English SC",
    cssVar: "--font-im-fell",
    role: "ornament",
    googleHref: "https://fonts.google.com/specimen/IM+Fell+English+SC",
  },
  {
    name: "JetBrains Mono",
    cssVar: "--font-jetbrains",
    role: "mono",
    googleHref: "https://fonts.google.com/specimen/JetBrains+Mono",
  },
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
  light: "#ead9b8",
  dark: "#0a0806",
} as const;
export type PngColorKey = keyof typeof PNG_COLORS;
