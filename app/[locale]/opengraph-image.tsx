import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadMessages } from "@/i18n/messages";
import { type Locale, routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The four-stage palette (see app/globals.css).
const NIGREDO = "#14110d";
const ALBEDO = "#ede6d6";
const CITRINITAS = "#e0ae45";

interface ImageProps {
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { locale } = (await params) ?? {};
  const { Metadata: copy } = await loadMessages(locale);

  return [{ id: "og", alt: copy.ogAlt, size, contentType }];
}

// The headline marks its key word as <accent>…</accent>, painted in gold.
const ACCENT_TAG = /<\/?accent>/;

/**
 * Satori lays out each child of a flex box as its own item, so the headline
 * goes word by word and wraps like text.
 */
const headlineWords = (headline: string) =>
  headline
    .split(ACCENT_TAG)
    .flatMap((part, index) =>
      part
        .split(" ")
        .filter(Boolean)
        .map((word) => ({ word, accent: index % 2 === 1 }))
    )
    .map((item, position) => ({ ...item, id: `${position}-${item.word}` }));

const asset = (path: string) => readFile(join(process.cwd(), "assets", path));

/**
 * A hook, large enough to read as a thumbnail in a feed: the headline in the
 * engraved display face over the darkened workshop, with a small lockup of
 * the mark and the name underneath so the brand is there without leading.
 */
export default async function Image({ params }: ImageProps) {
  const { locale } = (await params) ?? {};
  const { Metadata: copy } = await loadMessages(locale);

  const [imFell, scene] = await Promise.all([
    asset("fonts/IMFellEnglish-Regular.woff"),
    asset("og/taller.jpg"),
  ]);
  const sceneSrc = `data:image/jpeg;base64,${scene.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: NIGREDO,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: Satori renders plain img */}
      <img
        alt=""
        height={630}
        src={sceneSrc}
        style={{ position: "absolute", inset: 0 }}
        width={1200}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "IM Fell English",
            fontSize: 156,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 38,
            maxWidth: 900,
            color: ALBEDO,
          }}
        >
          {headlineWords(copy.ogHeadline).map(({ id, word, accent }) => (
            <span key={id} style={accent ? { color: CITRINITAS } : {}}>
              {word}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 44,
          }}
        >
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: Satori would paint the title as text; the card has its own alt */}
          <svg
            fill="none"
            height="52"
            stroke={CITRINITAS}
            strokeWidth="2"
            viewBox="0 0 40 40"
            width="52"
          >
            <circle cx="20" cy="20" r="16" />
            <path d="M20 8 L30 26 L10 26 Z" />
            <circle cx="20" cy="20" fill={CITRINITAS} r="2.4" />
          </svg>
          <div
            style={{
              display: "flex",
              fontFamily: "IM Fell English",
              fontSize: 46,
              lineHeight: 1,
              color: CITRINITAS,
            }}
          >
            Alquimia
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "IM Fell English", data: imFell, style: "normal", weight: 400 },
      ],
    }
  );
}
