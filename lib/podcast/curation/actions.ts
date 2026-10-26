"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, fail, ok } from "@/lib/launchpad/action-result";
import {
  ForbiddenError,
  requireAdmin,
  UnauthorizedError,
} from "@/lib/launchpad/session";
import { runCuration } from "./run";
import type { CurationStatus } from "./types";

interface CurateResult {
  failedSources: number;
  status: Exclude<CurationStatus, "running">;
  topCount: number;
}

export async function curateCandidates(): Promise<ActionResult<CurateResult>> {
  try {
    const admin = await requireAdmin();
    const { result } = await runCuration({ triggeredById: admin.id });

    revalidatePath("/[locale]/admin/podcast", "page");

    return ok({
      status: result.status,
      failedSources: new Set(result.errors.map((error) => error.source)).size,
      topCount: result.candidates.filter(
        (candidate) => candidate.topPosition !== null
      ).length,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return fail("unauthorized");
    }

    if (error instanceof ForbiddenError) {
      return fail("forbidden");
    }

    process.stderr.write(`[podcast] ${String(error)}\n`);

    return fail("unexpected");
  }
}
