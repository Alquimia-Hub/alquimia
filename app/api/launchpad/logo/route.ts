import { NextResponse } from "next/server";
import { LOGO_MAX_BYTES, RATE_LIMITS } from "@/lib/launchpad/constants";
import { consumeRateLimit } from "@/lib/launchpad/rate-limit";
import { getCurrentUser } from "@/lib/launchpad/session";
import { InvalidLogoError, uploadProjectLogo } from "@/lib/launchpad/storage";
import { publicUrl } from "@/lib/site-url";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).host === new URL(publicUrl()).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { limit, windowMs } = RATE_LIMITS.uploadLogo;

  if (!(await consumeRateLimit("uploadLogo", user.id, limit, windowMs))) {
    return NextResponse.json({ error: "tooFast" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > LOGO_MAX_BYTES * 2) {
    return NextResponse.json({ error: "logoTooLarge" }, { status: 413 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "logoBadFormat" }, { status: 400 });
  }

  try {
    const url = await uploadProjectLogo(file);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof InvalidLogoError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    process.stderr.write(`[launchpad] logo upload: ${String(error)}\n`);

    return NextResponse.json({ error: "unexpected" }, { status: 500 });
  }
}
