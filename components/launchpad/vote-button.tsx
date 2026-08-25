"use client";

import { Sparkles, Triangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOptimistic, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const SPARK_COUNT = 8;
const SPARK_RADIUS_PX = 34;
const BURST_MS = 1000;

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
  const translateError = useActionError();
  const [, startTransition] = useTransition();
  const [signInOpen, setSignInOpen] = useState(false);
  const [superVoteOpen, setSuperVoteOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const burstTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const weight = isAlquimista ? VOTE_WEIGHT_ALQUIMISTA : VOTE_WEIGHT_DEFAULT;

  const [optimistic, setOptimistic] = useOptimistic(
    { score, hasVoted },
    (state) => ({
      score: state.hasVoted ? state.score - weight : state.score + weight,
      hasVoted: !state.hasVoted,
    })
  );

  const celebrate = () => {
    setBurstKey((key) => key + 1);

    if (burstTimeout.current) {
      clearTimeout(burstTimeout.current);
    }

    burstTimeout.current = setTimeout(() => setBurstKey(0), BURST_MS);
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      setSignInOpen(true);
      return;
    }

    const isNewVote = !optimistic.hasVoted;

    if (isNewVote) {
      celebrate();
    }

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

  const bursting = burstKey > 0;

  const button = (
    <Button
      aria-label={isAuthenticated ? label : t("loginToVote")}
      aria-pressed={optimistic.hasVoted}
      className={cn(
        "vote-button h-auto flex-col gap-0.5 border font-[family-name:var(--font-jetbrains)] tabular-nums",
        size === "sm" ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm",
        optimistic.hasVoted &&
          isAlquimista &&
          "border-elixir/60 bg-elixir/15 text-elixir-2 hover:border-elixir hover:bg-elixir/25 hover:text-elixir-2",
        optimistic.hasVoted &&
          !isAlquimista &&
          "border-gold/70 bg-gold/15 text-gold-2 hover:border-gold hover:bg-gold/25 hover:text-gold-2",
        !optimistic.hasVoted &&
          "border-rule bg-transparent text-ink-2 hover:border-gold/60 hover:bg-gold/10 hover:text-gold-2"
      )}
      data-burst={bursting}
      data-super={isAlquimista}
      data-testid={`vote-${projectId}`}
      onClick={handleClick}
      variant="ghost"
    >
      <span className="vote-icon relative flex items-center justify-center">
        <VoteIcon hasVoted={optimistic.hasVoted} isAlquimista={isAlquimista} />
      </span>
      <span className={size === "sm" ? "text-sm" : "text-base"}>
        {optimistic.score}
      </span>

      {bursting && <span className="vote-sheen" key={`sheen-${burstKey}`} />}

      {bursting && <Burst isAlquimista={isAlquimista} key={burstKey} />}

      {bursting && (
        <span
          className="vote-delta font-[family-name:var(--font-jetbrains)] text-xs"
          key={`delta-${burstKey}`}
        >
          {t("delta", { count: weight })}
        </span>
      )}
    </Button>
  );

  return (
    <>
      {isAlquimista ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent className="border-elixir/40" side="left">
            {t("doubleHint")}
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}

      <SignInDialog onOpenChange={setSignInOpen} open={signInOpen} />
      <SuperVotePrompt onOpenChange={setSuperVoteOpen} open={superVoteOpen} />
    </>
  );
}

function Burst({ isAlquimista }: { isAlquimista: boolean }) {
  return (
    <>
      <span className="vote-ring" />
      {Array.from({ length: SPARK_COUNT }, (_, index) => {
        const angle = (index / SPARK_COUNT) * 2 * Math.PI;
        const spread = index % 2 === 0 ? 1 : 0.65;

        return (
          <span
            className="vote-spark"
            key={angle}
            style={
              {
                "--spark-x": `${Math.cos(angle) * SPARK_RADIUS_PX * spread}px`,
                "--spark-y": `${Math.sin(angle) * SPARK_RADIUS_PX * spread}px`,
                "--spark-delay": `${index * 22}ms`,
                "--spark-color":
                  isAlquimista && index % 2 === 0
                    ? "var(--gold-2)"
                    : "var(--vote-glow)",
              } as React.CSSProperties
            }
          />
        );
      })}
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
  const className = cn(
    "size-4 transition-colors",
    hasVoted && (isAlquimista ? "fill-elixir/50" : "fill-gold/50")
  );

  return isAlquimista ? (
    <Sparkles aria-hidden="true" className={className} />
  ) : (
    <Triangle aria-hidden="true" className={className} />
  );
}
