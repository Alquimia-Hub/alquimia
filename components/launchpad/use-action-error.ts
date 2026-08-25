"use client";

import { useTranslations } from "next-intl";
import type { ActionError } from "@/lib/launchpad/action-result";

export function useActionError() {
  const t = useTranslations("LaunchpadErrors");

  return (error: ActionError) =>
    t(error.key, error.values as Record<string, never> | undefined);
}
