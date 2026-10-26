"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { useActionError } from "@/components/launchpad/use-action-error";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { curateCandidates } from "@/lib/podcast/curation/actions";

export function CurateButton() {
  const t = useTranslations("PodcastAdmin");
  const translateError = useActionError();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const curate = () => {
    startTransition(async () => {
      const result = await curateCandidates();

      if (!result.ok) {
        toast.error(translateError(result.error));
        return;
      }

      if (result.data.status === "failed") {
        toast.error(t("runFailed"));
      } else if (result.data.failedSources > 0) {
        toast.warning(
          t("curatedWithErrors", {
            count: result.data.topCount,
            failed: result.data.failedSources,
          })
        );
      } else {
        toast.success(t("curated", { count: result.data.topCount }));
      }
      router.refresh();
    });
  };

  return (
    <Button data-testid="curate" disabled={isPending} onClick={curate}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {isPending ? t("curating") : t("curate")}
    </Button>
  );
}
