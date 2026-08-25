import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { CONTENT_TYPES, DEV_UPLOADS_DIR } from "@/lib/launchpad/storage";

const SAFE_FILENAME = /^[A-Za-z0-9_-]{1,32}\.(webp|png|jpg)$/;

const ONE_YEAR = 31_536_000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  const { file } = await params;

  if (!SAFE_FILENAME.test(file)) {
    return new NextResponse(null, { status: 400 });
  }

  const extension = file.split(".").pop() ?? "";

  try {
    const body = await readFile(path.join(DEV_UPLOADS_DIR, file));

    return new NextResponse(new Uint8Array(body), {
      headers: {
        "content-type": CONTENT_TYPES[extension] ?? "application/octet-stream",
        "cache-control": `public, max-age=${ONE_YEAR}, immutable`,
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
