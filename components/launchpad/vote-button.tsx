"use client";

import { Sparkles, Triangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { Button } from "@/components/ui/button";
import { toggleVote } from "@/lib/launchpad/actions";
import {
  VOTE_WEIGHT_ALQUIMISTA,
  VOTE_WEIGHT_DEFAULT,
} from "@/lib/launchpad/constants";
import { cn } from "@/lib/utils";
import {
  hasDismissedSuperVotePrompt,
  SuperVotePrompt,
} from "./super-vote-prompt";
import { useActionError } from "./use-action-error";

const VOTE_LABELS = {
  user: { idle: "support", voted: "supported" },
  alquimista: { idle: "superSupport", voted: "superSupported" },
} as const;

interface VoteButtonProps {
  hasVoted: boolean;
  isAlquimista: boolean;
  isAuthenticated: boolean;
  isOwner?: boolean;
  projectId: string;
  score: number;
  size?: "sm" | "lg";
}

export function VoteButton({
  projectId,
  score,
  hasVoted,
  isAuthenticated,
  isAlquimista,
  isOwner = false,
  size = "sm",
}: VoteButtonProps) {
  const t = useTranslations("LaunchpadVote");
  const translateError = useActionError();
  const [, startTransition] = useTransition();
  const [signInOpen, setSignInOpen] = useState(false);
  const [superVoteOpen, setSuperVoteOpen] = useState(false);

  const weight = isAlquimista ? VOTE_WEIGHT_ALQUIMISTA : VOTE_WEIGHT_DEFAULT;

  const [optimistic, setOptimistic] = useOptimistic(
    { score, hasVoted },
    (state) => ({
      score: state.hasVoted ? state.score - weight : state.score + weight,
      hasVoted: !state.hasVoted,
    })
  );

  const handleClick = () => {
    if (!isAuthenticated) {
      setSignInOpen(true);
      return;
    }

    if (isOwner) {
      return;
    }

    const isNewVote = !optimistic.hasVoted;

    startTransition(async () => {
      setOptimistic(null);
      const result = await toggleVote(projectId);

      if (!result.ok) {
        toast.error(translateError(result.error));
        return;
      }

      if (
        result.data.voted &&
        isNewVote &&
        !isAlquimista &&
        !hasDismissedSuperVotePrompt()
      ) {
        setSuperVoteOpen(true);
      }
    });
  };

  const label = t(
    VOTE_LABELS[isAlquimista ? "alquimista" : "user"][
      optimistic.hasVoted ? "voted" : "idle"
    ]
  );

  const ariaLabel = (() => {
    if (isOwner) {
      return t("ownProject");
    }

    return isAuthenticated ? label : t("loginToVote");
  })();

  return (
    <>
      <Button
        aria-label={ariaLabel}
        aria-pressed={optimistic.hasVoted}
        className={cn(
          "group h-auto flex-col gap-0.5 border font-[family-name:var(--font-jetbrains)] tabular-nums transition-colors",
          size === "sm" ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm",
          optimistic.hasVoted
            ? "border-gold bg-gold/15 text-gold-2 hover:bg-gold/20"
            : "border-rule bg-transparent text-ink-2 hover:border-gold/60 hover:text-gold-2"
        )}
        data-testid={`vote-${projectId}`}
        disabled={isOwner}
        onClick={handleClick}
        title={isOwner ? t("ownProject") : undefined}
        variant="ghost"
      >
        <VoteIcon hasVoted={optimistic.hasVoted} isAlquimista={isAlquimista} />
        <span className={size === "sm" ? "text-sm" : "text-base"}>
          {optimistic.score}
        </span>
      </Button>

      <SignInDialog onOpenChange={setSignInOpen} open={signInOpen} />
      <SuperVotePrompt onOpenChange={setSuperVoteOpen} open={superVoteOpen} />
    </>
  );
}

function VoteIcon({
  isAlquimista,
  hasVoted,
}: {
  isAlquimista: boolean;
  hasVoted: boolean;
}) {
  const className = cn("size-4", hasVoted && "fill-gold/40");

  return isAlquimista ? (
    <Sparkles className={className} />
  ) : (
    <Triangle className={className} />
  );
}
