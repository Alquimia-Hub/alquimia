"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
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
}

export function AlquimistaCard({
  isAlquimista,
  hasDiscordLinked,
  checkedAt,
}: AlquimistaCardProps) {
  const t = useTranslations("Account");
  const format = useFormatter();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [linking, setLinking] = useState(false);

  const linkDiscord = async () => {
    setLinking(true);

    await authClient.linkSocial({
      provider: DISCORD_PROVIDER,
      scopes: DISCORD_SCOPES,

      callbackURL: `${window.location.pathname}?discord=linked`,
    });
  };

  const revalidate = () => {
    startTransition(async () => {
      const result = await revalidateAlquimistaBadge();

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      if (result.data.isAlquimista) {
        toast.success(t("badgeVerified"));
      } else if (result.data.reason === "not-member") {
        toast.error(t("badgeNotMember"));
      } else if (result.data.reason === "unavailable") {
        toast.error(t("badgeUnavailable"));
      }
    });
  };

  const justLinked = searchParams.get("discord") === "linked";
  const autoChecked = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: corre una sola vez al volver del callback, no en cada render
  useEffect(() => {
    if (!justLinked || autoChecked.current) {
      return;
    }

    autoChecked.current = true;
    revalidate();
    router.replace(window.location.pathname);
  }, [justLinked]);

  return (
    <section
      className={cn(
        "flex flex-col gap-4 border px-6 py-6",
        isAlquimista ? "border-gold/40 bg-gold/5" : "border-rule-2 bg-bg-2/60"
      )}
      data-testid="alquimista-card"
    >
      <div className="flex items-center gap-2">
        <Sparkles
          aria-hidden="true"
          className={cn(
            "size-5",
            isAlquimista ? "fill-gold/40 text-gold" : "text-ink-4"
          )}
        />
        <h2 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-ink text-xl">
          {t("badgeTitle")}
        </h2>
      </div>

      <div>
        <p className="m-0 font-medium text-ink" data-testid="badge-state">
          {isAlquimista ? t("badgeVerified") : t("badgeMissing")}
        </p>
        <p className="mt-1 mb-0 text-ink-3 text-sm">
          {isAlquimista ? t("badgeVerifiedBody") : t("badgeMissingBody")}
        </p>
      </div>

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

        {!isAlquimista && (
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
