import { useTranslations } from "next-intl";
import { getCategory } from "@/lib/launchpad/categories";
import { cn } from "@/lib/utils";

export function CategoryChip({
  categoryId,
  className,
}: {
  categoryId: string;
  className?: string;
}) {
  const t = useTranslations("Launchpad.categories");
  const category = getCategory(categoryId);

  if (!category) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center bg-bg-3 px-2 py-0.5 text-ink-2 text-note",
        className
      )}
    >
      {t(categoryId as Parameters<typeof t>[0])}
    </span>
  );
}
