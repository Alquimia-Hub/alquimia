import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadMessages } from "@/i18n/messages";
import { type Locale, routing } from "@/i18n/routing";
import { COMMUNITY_MEMBERS } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The four-stage palette (see app/globals.css).
const NIGREDO = "#14110d";
const ALBEDO = "#ede6d6";
const ALBEDO_2 = "#cfc5b0";
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
 * The hero, as a card: the great workshop with its archway, the title in the
 * engraved display face and the sentence that says what Alquimia is.
 */
export default async function Image({ params }: ImageProps) {
  const { locale } = (await params) ?? {};
  const { Hero: hero } = await loadMessages(locale);

  const [imFell, literata, literataSemiBold, scene] = await Promise.all([
    asset("fonts/IMFellEnglish-Regular.woff"),
    asset("fonts/Literata-Regular.woff"),
    asset("fonts/Literata-SemiBold.woff"),
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
        fontFamily: "Literata",
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
          position: "absolute",
          top: 40,
          left: 48,
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: ALBEDO,
          fontFamily: "Literata SemiBold",
          fontSize: 30,
        }}
      >
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: Satori would paint the title as text; the card has its own alt */}
        <svg
          fill="none"
          height="40"
          stroke={CITRINITAS}
          strokeWidth="1.6"
          viewBox="0 0 40 40"
          width="40"
        >
          <circle cx="20" cy="20" r="16" />
          <path d="M20 8 L30 26 L10 26 Z" />
          <circle cx="20" cy="20" fill={CITRINITAS} r="2" />
        </svg>
        Alquimia
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 150px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "IM Fell English",
            fontSize: 100,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: ALBEDO,
            textAlign: "center",
            justifyContent: "center",
            maxWidth: 600,
          }}
        >
          {hero.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            lineHeight: 1.4,
            color: ALBEDO,
            maxWidth: 640,
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {hero.subtitle}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontFamily: "Literata SemiBold",
            fontSize: 26,
            color: CITRINITAS,
          }}
        >
          {hero.members.replace("{count}", String(COMMUNITY_MEMBERS))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 48,
          bottom: 40,
          display: "flex",
          fontSize: 22,
          color: ALBEDO_2,
        }}
      >
        alquimia.community
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "IM Fell English", data: imFell, style: "normal", weight: 400 },
        { name: "Literata", data: literata, style: "normal", weight: 400 },
        {
          name: "Literata SemiBold",
          data: literataSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
