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
        className="border-gold/40 bg-gradient-to-br from-gold/10 via-bg-2 to-elixir/10"
        data-testid="super-vote-prompt"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-ink">
            <Sparkles
              aria-hidden="true"
              className="size-5 fill-gold/40 text-gold"
            />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-ink-2">
            {t("body")}
          </DialogDescription>
        </DialogHeader>

        <Link
          className="w-fit font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-3 uppercase tracking-[0.14em] transition-colors duration-200 hover:text-gold-2"
          href="/alquimista"
          onClick={() => onOpenChange(false)}
        >
          {t("learnMore")}
        </Link>

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
