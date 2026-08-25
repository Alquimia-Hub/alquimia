"use client";

import { Flag, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { reportProject } from "@/lib/launchpad/actions";
import { PROJECT_LIMITS } from "@/lib/launchpad/constants";
import { useActionError } from "./use-action-error";

export function ReportDialog({ projectId }: { projectId: string }) {
  const t = useTranslations("LaunchpadDetail");
  const translateError = useActionError();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      const result = await reportProject({ projectId, reason });

      if (result.ok) {
        toast.success(t("reportSent"));
        setOpen(false);
        setReason("");
      } else {
        toast.error(translateError(result.error));
      }
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button data-testid="report-open" size="sm" variant="ghost">
          <Flag className="size-4" />
          {t("report")}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-rule bg-bg-2">
        <DialogHeader>
          <DialogTitle>{t("reportTitle")}</DialogTitle>
          <DialogDescription>{t("reportBody")}</DialogDescription>
        </DialogHeader>

        <Textarea
          data-testid="report-reason"
          maxLength={PROJECT_LIMITS.reportReason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t("reportPlaceholder")}
          value={reason}
        />

        <DialogFooter>
          <Button
            data-testid="report-submit"
            disabled={isPending || reason.trim().length < 10}
            onClick={submit}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {t("reportSubmit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
