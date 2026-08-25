"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/user-avatar";
import { authClient } from "@/lib/auth-client";

interface AvatarPrivacyCardProps {
  email: string;
  hideAvatar: boolean;
  image: string | null;
  name: string;
}

export function AvatarPrivacyCard({
  email,
  hideAvatar,
  image,
  name,
}: AvatarPrivacyCardProps) {
  const t = useTranslations("Account");
  const router = useRouter();
  const [hidden, setHidden] = useState(hideAvatar);
  const [isPending, startTransition] = useTransition();

  const save = (next: boolean) => {
    setHidden(next);

    startTransition(async () => {
      const { error } = await authClient.updateUser({ hideAvatar: next });

      if (error) {
        setHidden(!next);
        toast.error(t("avatarError"));
        return;
      }

      toast.success(t("avatarSaved"));
      router.refresh();
    });
  };

  return (
    <section className="flex flex-col gap-5 border border-rule-2 bg-bg-2/60 px-6 py-6">
      <h2 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-ink text-xl">
        {t("avatarTitle")}
      </h2>

      <div className="flex items-center gap-4">
        <UserAvatar
          className="size-12 border-rule"
          hideAvatar={hidden}
          image={image}
          name={name}
          standalone
        />
        <div className="min-w-0">
          <p className="m-0 font-medium text-ink">{name}</p>
          <p className="m-0 truncate text-ink-3 text-sm">{email}</p>
          <p className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-4 uppercase tracking-[0.12em]">
            {t("avatarPreview")}
          </p>
        </div>
      </div>

      <hr className="m-0 border-0 border-rule-2 border-t" />

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <Label className="text-ink" htmlFor="hide-avatar">
            {t("avatarToggle")}
          </Label>
          <p className="mt-1.5 mb-0 text-ink-3 text-sm leading-relaxed">
            {hidden ? t("avatarToggleHint") : t("avatarBody")}
          </p>
        </div>

        <Switch
          checked={hidden}
          data-testid="hide-avatar"
          disabled={isPending}
          id="hide-avatar"
          onCheckedChange={save}
        />
      </div>
    </section>
  );
}
