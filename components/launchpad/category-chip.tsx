import { useTranslations } from "next-intl";
import { getCategory } from "@/lib/launchpad/categories";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  violet: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
  pink: "border-pink-500/30 bg-pink-500/10 text-pink-200",
  orange: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  fuchsia: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200",
};

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
        "inline-flex items-center border px-2 py-0.5 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.12em]",
        TONES[category.color],
        className
      )}
    >
      {t(categoryId as Parameters<typeof t>[0])}
    </span>
  );
}
