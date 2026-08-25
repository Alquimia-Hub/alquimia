"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const DEV_PROVIDERS = process.env.NODE_ENV !== "production";

const REAL_PROVIDERS = (process.env.NEXT_PUBLIC_SOCIAL_PROVIDERS ?? "").split(
  ","
);
const hasGoogle = REAL_PROVIDERS.includes("google");
const hasDiscord = REAL_PROVIDERS.includes("discord");

interface SignInDialogProps {
  callbackURL?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function SignInDialog({
  open,
  onOpenChange,
  callbackURL,
}: SignInDialogProps) {
  const t = useTranslations("Auth");
  const [pending, setPending] = useState<string | null>(null);

  const target =
    callbackURL ??
    (typeof window === "undefined"
      ? "/"
      : window.location.pathname + window.location.search);

  const signInSocial = async (provider: string) => {
    setPending(provider);
    await authClient.signIn.social({ provider, callbackURL: target });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-rule bg-bg-2 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-cormorant)] font-light text-2xl">
            {t("signInTitle")}
          </DialogTitle>
          <DialogDescription>{t("signInBody")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {hasGoogle && (
            <Button
              disabled={pending !== null}
              onClick={() => signInSocial("google")}
              size="lg"
              variant="outline"
            >
              {pending === "google" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <GoogleMark />
              )}
              {t("google")}
            </Button>
          )}

          {hasDiscord && (
            <Button
              disabled={pending !== null}
              onClick={() => signInSocial("discord")}
              size="lg"
              variant="outline"
            >
              {pending === "discord" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <DiscordMark />
              )}
              {t("discord")}
            </Button>
          )}

          {DEV_PROVIDERS && (
            <div
              className={cn(
                "flex flex-col gap-2",
                (hasGoogle || hasDiscord) && "mt-3 border-rule-2 border-t pt-3"
              )}
            >
              <p className="font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-4 uppercase tracking-[0.12em]">
                {t("devNotice")}
              </p>
              <Button
                data-testid="signin-google-dev"
                disabled={pending !== null}
                onClick={() => signInSocial("google-dev")}
                size="sm"
                variant="ghost"
              >
                {t("googleDev")}
              </Button>
              <Button
                data-testid="signin-discord-dev"
                disabled={pending !== null}
                onClick={() => signInSocial("discord-dev")}
                size="sm"
                variant="ghost"
              >
                {t("discordDev")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44a5.4 5.4 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.59-5.17 3.59-8.82Z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function DiscordMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="#5865F2"
      viewBox="0 0 24 24"
    >
      <path d="M20.32 4.56A19.79 19.79 0 0 0 15.43 3c-.24.43-.5 1-.68 1.46a18.3 18.3 0 0 0-5.5 0C9.07 4 8.8 3.43 8.56 3a19.74 19.74 0 0 0-4.89 1.56C.55 9.2-.3 13.72.13 18.18a19.9 19.9 0 0 0 6.05 3.06c.49-.66.92-1.37 1.29-2.11-.71-.27-1.39-.6-2.03-.98.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.12 0c.16.14.33.27.5.4-.64.38-1.32.71-2.03.98.37.74.8 1.45 1.29 2.11a19.87 19.87 0 0 0 6.05-3.06c.5-5.17-.85-9.65-3.55-13.62ZM8.02 15.44c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.43 2.15-2.43 1.21 0 2.18 1.1 2.16 2.43 0 1.33-.95 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.34.95-2.43 2.15-2.43 1.21 0 2.18 1.1 2.16 2.43 0 1.33-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}
