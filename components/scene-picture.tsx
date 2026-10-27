import { getImageProps } from "next/image";
import { cn } from "@/lib/utils";

// Images ship unoptimized (see next.config.mjs), so every scene is encoded
// ahead of time in public/images/hero as AVIF and WebP at fixed widths.
const SCENE_DIR = "/images/hero";

const srcSet = (name: string, widths: readonly number[], ext: string) =>
  widths.map((w) => `${SCENE_DIR}/${name}-${w}.${ext} ${w}w`).join(", ");

const HERO_WIDE = [768, 1152, 1536] as const;
const HERO_TALL = [512, 768, 1024] as const;

// Phones and narrow windows get the vertical scene, which keeps the side
// stations visible above and below the archway.
const TALL_MEDIA = "(max-aspect-ratio: 4/5)";

export function HeroScene({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  const { props } = getImageProps({
    alt,
    src: `${SCENE_DIR}/taller-1536.webp`,
    width: 1536,
    height: 1024,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <picture className={cn("block size-full", className)}>
      <source
        media={TALL_MEDIA}
        sizes="100vw"
        srcSet={srcSet("taller-vertical", HERO_TALL, "avif")}
        type="image/avif"
      />
      <source
        media={TALL_MEDIA}
        sizes="100vw"
        srcSet={srcSet("taller-vertical", HERO_TALL, "webp")}
        type="image/webp"
      />
      <source
        sizes="100vw"
        srcSet={srcSet("taller", HERO_WIDE, "avif")}
        type="image/avif"
      />
      <source
        sizes="100vw"
        srcSet={srcSet("taller", HERO_WIDE, "webp")}
        type="image/webp"
      />
      <img
        {...props}
        alt={props.alt}
        className="size-full object-cover object-[50%_42%]"
        height={props.height}
        srcSet={srcSet("taller", HERO_WIDE, "webp")}
        width={props.width}
      />
    </picture>
  );
}

/**
 * The plates of the landing, one per place, listed with their prompts in
 * docs/ilustraciones.md. Each PNG lives in public/images/hero and is encoded
 * to AVIF and WebP with scripts/encode-plates.mjs.
 */
const PLATES = {
  umbral: { width: 1536, height: 1024, tall: true },
  "stage-nigredo": { width: 1024, height: 1536 },
  "stage-albedo": { width: 1024, height: 1536 },
  "stage-citrinitas": { width: 1024, height: 1536 },
  "stage-rubedo": { width: 1024, height: 1536 },
  obra: { width: 1536, height: 1024 },
  capitular: { width: 1254, height: 1254 },
  "cierre-mesa": { width: 1536, height: 1024 },
} as const satisfies Record<
  string,
  { width: number; height: number; tall?: boolean }
>;

export type PlateName = keyof typeof PLATES;

export function Plate({
  name,
  alt,
  className,
  imgClassName,
  sizes,
  position,
}: {
  name: PlateName;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes: string;
  /** `object-position` inside the frame. */
  position?: string;
}) {
  const plate: (typeof PLATES)[PlateName] = PLATES[name];

  const { props } = getImageProps({
    alt,
    src: `${SCENE_DIR}/${name}.webp`,
    sizes,
    width: plate.width,
    height: plate.height,
  });

  return (
    <picture className={cn("block", className)}>
      {"tall" in plate && plate.tall && (
        <>
          <source
            media={TALL_MEDIA}
            srcSet={`${SCENE_DIR}/${name}-vertical.avif`}
            type="image/avif"
          />
          <source
            media={TALL_MEDIA}
            srcSet={`${SCENE_DIR}/${name}-vertical.webp`}
            type="image/webp"
          />
        </>
      )}
      <source srcSet={`${SCENE_DIR}/${name}.avif`} type="image/avif" />
      <img
        {...props}
        alt={props.alt}
        className={cn("size-full object-cover", imgClassName)}
        height={props.height}
        style={position ? { objectPosition: position } : undefined}
        width={props.width}
      />
    </picture>
  );
}
