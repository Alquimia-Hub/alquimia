import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { env } from "@/lib/env";
import { LOGO_MAX_BYTES } from "./constants";

const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

const ALLOWED_TYPES = Object.keys(EXTENSIONS);

export const DEV_UPLOADS_DIR = path.join(process.cwd(), ".dev-uploads");

export const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
};

export class InvalidLogoError extends Error {}

export async function uploadProjectLogo(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new InvalidLogoError("El logo debe ser WebP, PNG o JPG");
  }

  if (file.size > LOGO_MAX_BYTES) {
    throw new InvalidLogoError("El logo supera el maximo de 1 MB");
  }

  const extension = EXTENSIONS[file.type];
  const key = nanoid();
  const filename = `launchpad/${key}.${extension}`;

  if (env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type,
    });

    return blob.url;
  }

  await mkdir(DEV_UPLOADS_DIR, { recursive: true });

  const localName = `${key}.${extension}`;
  await writeFile(
    path.join(DEV_UPLOADS_DIR, localName),
    Buffer.from(await file.arrayBuffer())
  );

  return `/api/dev-uploads/${localName}`;
}
