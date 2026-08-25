import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { env } from "@/lib/env";
import { LOGO_MAX_BYTES } from "./constants";
import { DEV_UPLOAD_PREFIX } from "./logo-url";

const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

export const DEV_UPLOADS_DIR = path.join(process.cwd(), ".dev-uploads");

export const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
};

export class InvalidLogoError extends Error {}

const usesBlobStorage = () =>
  Boolean(env.BLOB_READ_WRITE_TOKEN) && process.env.NODE_ENV !== "development";

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => bytes[offset + index] === byte);

function sniffImageType(bytes: Uint8Array): string | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }

  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return "image/jpeg";
  }

  const isRiff = startsWith(bytes, [0x52, 0x49, 0x46, 0x46]);
  const isWebp = startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8);

  if (isRiff && isWebp) {
    return "image/webp";
  }

  return null;
}

export async function uploadProjectLogo(file: File) {
  if (file.size > LOGO_MAX_BYTES) {
    throw new InvalidLogoError("logoTooLarge");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = sniffImageType(new Uint8Array(buffer));

  if (!contentType) {
    throw new InvalidLogoError("logoBadFormat");
  }

  const extension = EXTENSIONS[contentType];
  const key = nanoid();
  const filename = `launchpad/${key}.${extension}`;

  if (usesBlobStorage()) {
    const blob = await put(filename, buffer, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
      contentType,
    });

    return blob.url;
  }

  await mkdir(DEV_UPLOADS_DIR, { recursive: true });

  const localName = `${key}.${extension}`;
  await writeFile(path.join(DEV_UPLOADS_DIR, localName), buffer);

  return `${DEV_UPLOAD_PREFIX}${localName}`;
}

export async function deleteProjectLogo(logoUrl: string) {
  try {
    if (logoUrl.startsWith(DEV_UPLOAD_PREFIX)) {
      const name = logoUrl.slice(DEV_UPLOAD_PREFIX.length);
      await unlink(path.join(DEV_UPLOADS_DIR, name));
      return;
    }

    if (usesBlobStorage()) {
      await del(logoUrl, { token: env.BLOB_READ_WRITE_TOKEN });
    }
  } catch {
    return;
  }
}
