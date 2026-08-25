"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";
import { COMMUNITY_LINKS } from "@/lib/constants";

const DISMISSED_KEY = "alquimia:super-vote-prompt-dismissed";

export const hasDismissedSuperVotePrompt = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return true;
  }
};

const dismissForever = () => {
  try {
    localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    return;
  }
};

export function SuperVotePrompt({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("SuperVotePrompt");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="border-gold/40 bg-bg-2"
        data-testid="super-vote-prompt"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="size-5 text-gold" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("body")}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => {
              dismissForever();
              onOpenChange(false);
            }}
            size="sm"
            type="button"
            variant="ghost"
          >
            {t("dontShow")}
          </Button>

          <Button asChild size="sm" variant="outline">
            <a href={COMMUNITY_LINKS.discord} rel="noopener" target="_blank">
              {t("join")}
            </a>
          </Button>

          <Button asChild data-testid="super-vote-verify" size="sm">
            <Link href="/account">{t("verify")}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
