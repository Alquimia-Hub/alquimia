"use client";

import { Loader2, Sparkles, Triangle } from "lucide-react";
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

const VOTE_LABELS = {
  user: { idle: "support", voted: "supported" },
  alquimista: { idle: "superSupport", voted: "superSupported" },
} as const;

interface VoteButtonProps {
  hasVoted: boolean;
  isAlquimista: boolean;
  isAuthenticated: boolean;
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
  size = "sm",
}: VoteButtonProps) {
  const t = useTranslations("LaunchpadVote");
  const [isPending, startTransition] = useTransition();
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

    const isNewVote = !optimistic.hasVoted;

    startTransition(async () => {
      setOptimistic(null);
      const result = await toggleVote(projectId);

      if (!result.ok) {
        toast.error(result.error);
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

  return (
    <>
      <Button
        aria-label={isAuthenticated ? label : t("loginToVote")}
        aria-pressed={optimistic.hasVoted}
        className={cn(
          "group h-auto flex-col gap-0.5 border font-[family-name:var(--font-jetbrains)] tabular-nums transition-colors",
          size === "sm" ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm",
          optimistic.hasVoted
            ? "border-gold bg-gold/15 text-gold-2 hover:bg-gold/20"
            : "border-rule bg-transparent text-ink-2 hover:border-gold/60 hover:text-gold-2"
        )}
        data-testid={`vote-${projectId}`}
        disabled={isPending}
        onClick={handleClick}
        variant="ghost"
      >
        <VoteIcon
          hasVoted={optimistic.hasVoted}
          isAlquimista={isAlquimista}
          isPending={isPending}
        />
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
  isPending,
  isAlquimista,
  hasVoted,
}: {
  isPending: boolean;
  isAlquimista: boolean;
  hasVoted: boolean;
}) {
  if (isPending) {
    return <Loader2 className="size-4 animate-spin" />;
  }

  const className = cn("size-4", hasVoted && "fill-gold/40");

  return isAlquimista ? (
    <Sparkles className={className} />
  ) : (
    <Triangle className={className} />
  );
}
