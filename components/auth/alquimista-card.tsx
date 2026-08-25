"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useActionError } from "@/components/launchpad/use-action-error";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { COMMUNITY_LINKS } from "@/lib/constants";
import { revalidateAlquimistaBadge } from "@/lib/launchpad/actions";
import { DISCORD_SCOPES } from "@/lib/launchpad/discord-scopes";
import { cn } from "@/lib/utils";

const DISCORD_PROVIDER =
  process.env.NODE_ENV === "production" ? "discord" : "discord-dev";

interface AlquimistaCardProps {
  checkedAt: Date | null;
  hasDiscordLinked: boolean;
  isAlquimista: boolean;
  isStale: boolean;

  linkState: "error" | "linked" | null;
}

export function AlquimistaCard({
  isAlquimista,
  hasDiscordLinked,
  checkedAt,
  isStale,
  linkState,
}: AlquimistaCardProps) {
  const t = useTranslations("Account");
  const translateError = useActionError();
  const format = useFormatter();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [linking, setLinking] = useState(false);

  const linkDiscord = async () => {
    setLinking(true);

    await authClient.linkSocial({
      provider: DISCORD_PROVIDER,
      scopes: DISCORD_SCOPES,
      callbackURL: `${window.location.pathname}?discord=linked`,
      errorCallbackURL: `${window.location.pathname}?discord=error`,
    });
  };

  const revalidate = () => {
    startTransition(async () => {
      const result = await revalidateAlquimistaBadge();

      if (!result.ok) {
        toast.error(translateError(result.error));
        return;
      }

      if (result.data.isAlquimista) {
        toast.success(t("badgeVerified"));
      } else if (result.data.reason === "not-member") {
        toast.error(t("badgeNotMember"));
      } else if (result.data.reason === "already-claimed") {
        toast.error(t("badgeAlreadyClaimed"));
      } else if (result.data.reason === "unavailable") {
        toast.error(t("badgeUnavailable"));
      }
    });
  };

  const justLinked = linkState === "linked";

  const linkFailed = linkState === "error";
  const autoChecked = useRef(false);

  const needsAutoCheck = justLinked || (hasDiscordLinked && isStale);

  // biome-ignore lint/correctness/useExhaustiveDependencies: corre una sola vez por visita, no en cada render
  useEffect(() => {
    if (!needsAutoCheck || autoChecked.current) {
      return;
    }

    autoChecked.current = true;
    revalidate();

    if (justLinked) {
      router.replace(window.location.pathname);
    }
  }, [needsAutoCheck]);

  const isActive = isAlquimista && !isStale;

  const badgeHeadline = (() => {
    if (isAlquimista && isStale) {
      return t("badgeStale");
    }

    return isAlquimista ? t("badgeVerified") : t("badgeMissing");
  })();

  const badgeBody = (() => {
    if (isAlquimista && isStale) {
      return t("badgeStaleBody");
    }

    return isAlquimista ? t("badgeVerifiedBody") : t("badgeMissingBody");
  })();

  return (
    <section
      className={cn(
        "flex flex-col gap-4 border px-6 py-6",
        isActive ? "border-gold/40 bg-gold/5" : "border-rule-2 bg-bg-2/60"
      )}
      data-testid="alquimista-card"
    >
      <div className="flex items-center gap-2">
        <Sparkles
          aria-hidden="true"
          className={cn(
            "size-5",
            isActive ? "fill-gold/40 text-gold" : "text-ink-4"
          )}
        />
        <h2 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-ink text-xl">
          {t("badgeTitle")}
        </h2>
      </div>

      <div>
        <p className="m-0 font-medium text-ink" data-testid="badge-state">
          {badgeHeadline}
        </p>
        <p className="mt-1 mb-0 text-ink-3 text-sm">{badgeBody}</p>
      </div>

      {linkFailed && (
        <p
          className="m-0 border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive text-sm"
          data-testid="badge-link-error"
          role="alert"
        >
          {t("badgeAlreadyClaimed")}
        </p>
      )}

      {checkedAt && (
        <p className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-4 uppercase tracking-[0.12em]">
          {t("lastCheck", {
            date: format.dateTime(checkedAt, {
              dateStyle: "medium",
              timeStyle: "short",
            }),
          })}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {hasDiscordLinked ? (
          <Button
            data-testid="revalidate-badge"
            disabled={isPending}
            onClick={revalidate}
            size="sm"
            variant="outline"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? t("revalidating") : t("revalidate")}
          </Button>
        ) : (
          <Button
            data-testid="link-discord"
            disabled={linking}
            onClick={linkDiscord}
            size="sm"
          >
            {linking && <Loader2 className="size-4 animate-spin" />}
            {t("linkDiscord")}
          </Button>
        )}

        {!isActive && (
          <Button asChild size="sm" variant="ghost">
            <a href={COMMUNITY_LINKS.discord} rel="noopener" target="_blank">
              {t("joinDiscord")}
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}
