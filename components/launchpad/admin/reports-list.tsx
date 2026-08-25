"use client";

import { Loader2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveReport } from "@/lib/launchpad/actions";
import type { AdminReport } from "@/lib/launchpad/queries";

export function ReportsList({ reports }: { reports: AdminReport[] }) {
  const t = useTranslations("Admin");
  const format = useFormatter();
  const [isPending, startTransition] = useTransition();

  const resolve = (reportId: string, action: "dismiss" | "send-to-review") => {
    startTransition(async () => {
      const result = await resolveReport(reportId, action);

      if (result.ok) {
        toast.success(t("resolved"));
      } else {
        toast.error(result.error);
      }
    });
  };

  if (reports.length === 0) {
    return (
      <p className="border border-rule-2 border-dashed px-6 py-12 text-center text-ink-4">
        {t("reportsEmpty")}
      </p>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {reports.map((report) => (
        <li
          className="flex flex-wrap items-start justify-between gap-4 border border-rule-2 bg-bg-2/60 p-4"
          data-testid={`report-${report.id}`}
          key={report.id}
        >
          <div className="min-w-0 flex-1">
            <p className="m-0 font-medium text-ink">{report.projectName}</p>
            <p className="mt-1 mb-2 text-ink-2 text-sm">{report.reason}</p>
            <p className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-4 uppercase tracking-[0.12em]">
              {t("reportBy")} {report.reporterName} ·{" "}
              {format.dateTime(report.createdAt, { dateStyle: "short" })}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              disabled={isPending}
              onClick={() => resolve(report.id, "dismiss")}
              size="sm"
              variant="ghost"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {t("dismiss")}
            </Button>
            <Button
              disabled={isPending}
              onClick={() => resolve(report.id, "send-to-review")}
              size="sm"
              variant="outline"
            >
              {t("sendToReview")}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
