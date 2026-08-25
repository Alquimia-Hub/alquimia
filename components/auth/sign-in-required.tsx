"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SignInDialog } from "./sign-in-dialog";

export function SignInRequired({ callbackURL }: { callbackURL?: string }) {
  const t = useTranslations("Auth");
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <div>
        <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
          {t("requiredTitle")}
        </h1>
        <p className="mx-auto mt-4 mb-0 max-w-[46ch] text-ink-3">
          {t("requiredBody")}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button data-testid="signin-required" onClick={() => setOpen(true)}>
          {t("signIn")}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/launchpad">{t("backToLaunchpad")}</Link>
        </Button>
      </div>

      <SignInDialog
        callbackURL={callbackURL}
        onOpenChange={setOpen}
        open={open}
      />
    </div>
  );
}
