"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_LIMITS } from "@/lib/launchpad/constants";

const MIN_REASON_LENGTH = 5;

export function RejectDialog({
  open,
  onOpenChange,
  count,
  pending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  pending: boolean;
  onConfirm: (reason: string) => void;
}) {
  const t = useTranslations("Admin");
  const [reason, setReason] = useState("");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-rule bg-bg-2">
        <DialogHeader>
          <DialogTitle>{t("rejectTitle")}</DialogTitle>
          <DialogDescription>
            {t("rejectBody")} · {t("selected", { count })}
          </DialogDescription>
        </DialogHeader>

        <Textarea
          data-testid="reject-reason"
          maxLength={PROJECT_LIMITS.rejectionReason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t("rejectPlaceholder")}
          value={reason}
        />

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="ghost"
          >
            {t("cancel")}
          </Button>
          <Button
            data-testid="reject-confirm"
            disabled={pending || reason.trim().length < MIN_REASON_LENGTH}
            onClick={() => onConfirm(reason)}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {t("rejectConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
