"use client";

import { useTranslations } from "next-intl";
import { useFormField } from "@/components/ui/form";
import { MAX_CATEGORIES_PER_PROJECT } from "@/lib/launchpad/categories";
import { PROJECT_LIMITS } from "@/lib/launchpad/constants";

const MAX_BY_ERROR: Record<string, number> = {
  nameTooLong: PROJECT_LIMITS.name,
  taglineTooLong: PROJECT_LIMITS.tagline,
  descriptionTooLong: PROJECT_LIMITS.description,
  categoriesTooMany: MAX_CATEGORIES_PER_PROJECT,
};

export function FieldError({ message }: { message?: string }) {
  const t = useTranslations("LaunchpadForm.errors");
  const { formMessageId } = useFormField();

  if (!message) {
    return null;
  }

  const key = message as Parameters<typeof t>[0];
  const text = t.has(key)
    ? t(key, { max: MAX_BY_ERROR[message] ?? 0 })
    : message;

  return (
    <p className="m-0 font-medium text-destructive text-sm" id={formMessageId}>
      {text}
    </p>
  );
}
