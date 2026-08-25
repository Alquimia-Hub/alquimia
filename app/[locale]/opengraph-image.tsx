import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadMessages } from "@/i18n/messages";
import { type Locale, routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0806";
const INK = "#ead9b8";
const INK_3 = "#9d8b6a";
const GOLD = "#d99a3d";
const RULE = "rgba(217, 154, 61, 0.25)";

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

export default async function Image({ params }: ImageProps) {
  const { locale } = (await params) ?? {};
  const { Metadata: copy } = await loadMessages(locale);

  const [cormorantRegular, cormorantItalic, imFell, alchemistPng] =
    await Promise.all([
      readFile(
        join(process.cwd(), "assets/fonts/CormorantGaramond-Regular.ttf")
      ),
      readFile(
        join(process.cwd(), "assets/fonts/CormorantGaramond-Italic.ttf")
      ),
      readFile(join(process.cwd(), "assets/fonts/IMFellEnglishSC-Regular.ttf")),
      readFile(join(process.cwd(), "public/images/alchemist.png"), "base64"),
    ]);

  const alchemistSrc = `data:image/png;base64,${alchemistPng}`;

  const cornerBase = {
    position: "absolute" as const,
    width: 28,
    height: 28,
    borderColor: GOLD,
    opacity: 0.55,
  };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BG,
        backgroundImage: `linear-gradient(180deg, rgba(10,8,6,0.35) 0%, rgba(10,8,6,0.15) 20%, rgba(10,8,6,0.15) 80%, rgba(10,8,6,0.55) 100%), url(${alchemistSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        fontFamily: "Cormorant",
      }}
    >
      <div
        style={{
          ...cornerBase,
          top: 32,
          left: 32,
          borderTop: `1px solid ${GOLD}`,
          borderLeft: `1px solid ${GOLD}`,
        }}
      />
      <div
        style={{
          ...cornerBase,
          top: 32,
          right: 32,
          borderTop: `1px solid ${GOLD}`,
          borderRight: `1px solid ${GOLD}`,
        }}
      />
      <div
        style={{
          ...cornerBase,
          bottom: 32,
          left: 32,
          borderBottom: `1px solid ${GOLD}`,
          borderLeft: `1px solid ${GOLD}`,
        }}
      />
      <div
        style={{
          ...cornerBase,
          bottom: 32,
          right: 32,
          borderBottom: `1px solid ${GOLD}`,
          borderRight: `1px solid ${GOLD}`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: "60px 100px",
          background:
            "radial-gradient(ellipse at center, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.78) 40%, rgba(10,8,6,0) 85%)",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 220,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          <span style={{ fontFamily: "Cormorant" }}>Alquim</span>
          <span
            style={{
              fontFamily: "Cormorant Italic",
              fontStyle: "italic",
              color: GOLD,
            }}
          >
            ia
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: 640,
            gap: 20,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(to right, transparent, ${RULE}, ${RULE})`,
            }}
          />
          <svg
            fill="none"
            height="32"
            stroke={GOLD}
            strokeWidth="1"
            viewBox="0 0 40 40"
            width="32"
          >
            <title>Alquimia divider</title>
            <circle cx="20" cy="20" r="8" />
            <path d="M20 4 L32 28 L8 28 Z" />
            <circle cx="20" cy="20" fill={GOLD} r="1.5" />
          </svg>
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(to right, ${RULE}, ${RULE}, transparent)`,
            }}
          />
        </div>

        <div
          style={{
            fontFamily: "IM Fell",
            fontSize: 26,
            letterSpacing: "0.32em",
            color: INK_3,
            textTransform: "uppercase",
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          {copy.ogTagline}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Cormorant",
          data: cormorantRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Cormorant Italic",
          data: cormorantItalic,
          style: "italic",
          weight: 300,
        },
        {
          name: "IM Fell",
          data: imFell,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
