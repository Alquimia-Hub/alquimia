"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { deleteProject } from "@/lib/launchpad/actions";
import { useActionError } from "./use-action-error";

interface DeleteProjectButtonProps {
  disabled?: boolean;
  projectId: string;
  projectName: string;
  redirectTo?: string;
}

export function DeleteProjectButton({
  projectId,
  projectName,
  disabled = false,
  redirectTo,
}: DeleteProjectButtonProps) {
  const t = useTranslations("LaunchpadMine");
  const translateError = useActionError();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteProject(projectId);

      if (!result.ok) {
        toast.error(translateError(result.error));
        return;
      }

      toast.success(t("deleted"));
      setOpen(false);

      if (redirectTo) {
        router.push(redirectTo);
      }

      router.refresh();
    });
  };

  return (
    <>
      <Button
        data-testid={`delete-${projectId}`}
        disabled={disabled}
        onClick={() => setOpen(true)}
        size="sm"
        title={disabled ? t("deleteBlocked") : undefined}
        variant="ghost"
      >
        <Trash2 className="size-4" />
        {t("delete")}
      </Button>

      <AlertDialog onOpenChange={setOpen} open={open}>
        <AlertDialogContent className="border-rule bg-bg-2">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("deleteTitle", { project: projectName })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("deleteCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="delete-confirm"
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                confirm();
              }}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {t("deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
