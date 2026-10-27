// Encodes the plates of docs/ilustraciones.md to the AVIF and WebP files the
// site serves (images ship unoptimized, see next.config.mjs). The PNG sources
// live in assets/plates, outside public/, so they are never served.
// Usage: node scripts/encode-plates.mjs umbral umbral-vertical
import { existsSync } from "node:fs";
import sharp from "sharp";

const SOURCE_DIR = "assets/plates";
const DIR = "public/images/hero";
const names = process.argv.slice(2);

if (names.length === 0) {
  console.error("Usage: node scripts/encode-plates.mjs <plate> [...]");
  process.exit(1);
}

for (const name of names) {
  const source = `${SOURCE_DIR}/${name}.png`;
  if (!existsSync(source)) {
    console.error(`Missing ${source}`);
    process.exitCode = 1;
    continue;
  }
  const image = sharp(source).resize({ width: 1536, withoutEnlargement: true });
  await image
    .clone()
    .avif({ quality: 52, effort: 6 })
    .toFile(`${DIR}/${name}.avif`);
  await image.clone().webp({ quality: 78 }).toFile(`${DIR}/${name}.webp`);
  console.log(`${name}: avif + webp`);
}
