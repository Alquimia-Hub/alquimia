import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

const TONES: Record<Status, string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  approved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  rejected: "border-red-500/40 bg-red-500/10 text-red-200",
};

export function StatusChip({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const t = useTranslations("LaunchpadStatus");

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-[0.12em]",
        TONES[status],
        className
      )}
    >
      {t(status)}
    </span>
  );
}
