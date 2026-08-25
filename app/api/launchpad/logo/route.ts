import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/launchpad/session";
import { InvalidLogoError, uploadProjectLogo } from "@/lib/launchpad/storage";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  try {
    const url = await uploadProjectLogo(file);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof InvalidLogoError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
