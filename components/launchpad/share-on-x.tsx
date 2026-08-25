"use client";

import { useTranslations } from "next-intl";
import { XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function ShareOnX({
  projectName,
  launchpadUrl,
  label,
}: {
  projectName: string;
  launchpadUrl: string;
  label?: string;
}) {
  const t = useTranslations("LaunchpadSuccess");

  const intent = new URL("https://x.com/intent/post");
  intent.searchParams.set("text", t("shareText", { project: projectName }));
  intent.searchParams.set("url", launchpadUrl);

  return (
    <Button asChild data-testid="share-on-x">
      <a href={intent.href} rel="noopener" target="_blank">
        <XIcon className="size-4" />
        {label ?? t("shareCta")}
      </a>
    </Button>
  );
}
