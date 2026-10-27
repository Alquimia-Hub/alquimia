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

const asset = (path: string) => readFile(join(process.cwd(), "assets", path));

/**
 * The brand, large enough to read as a thumbnail: the mark and the name in
 * the engraved display face over the great workshop, and the hero's title.
 */
export default async function Image({ params }: ImageProps) {
  const { locale } = (await params) ?? {};
  const { Hero: hero } = await loadMessages(locale);

  const [imFell, literata, scene] = await Promise.all([
    asset("fonts/IMFellEnglish-Regular.woff"),
    asset("fonts/Literata-Regular.woff"),
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: Satori would paint the title as text; the card has its own alt */}
          <svg
            fill="none"
            height="170"
            stroke={CITRINITAS}
            strokeWidth="1.4"
            viewBox="0 0 40 40"
            width="170"
          >
            <circle cx="20" cy="20" r="16" />
            <path d="M20 8 L30 26 L10 26 Z" />
            <circle cx="20" cy="20" fill={CITRINITAS} r="2" />
          </svg>
          <div
            style={{
              display: "flex",
              fontFamily: "IM Fell English",
              fontSize: 190,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: ALBEDO,
            }}
          >
            Alquimia
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontFamily: "Literata",
            fontSize: 52,
            color: ALBEDO,
          }}
        >
          {hero.title}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "IM Fell English", data: imFell, style: "normal", weight: 400 },
        { name: "Literata", data: literata, style: "normal", weight: 400 },
      ],
    }
  );
}
