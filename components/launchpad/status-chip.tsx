import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

const TONES: Record<Status, string> = {
  pending: "bg-bg-3 text-gold",
  approved: "bg-bg-3 text-ink-2",
  rejected: "bg-rubedo text-albedo",
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
        "inline-flex items-center px-2 py-0.5 text-note",
        TONES[status],
        className
      )}
    >
      {t(status)}
    </span>
  );
}
