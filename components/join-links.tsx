import { useTranslations } from "next-intl";
import { COMMUNITY_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DiscordIcon, WhatsappIcon } from "./icons";

/** The two equal ways in: two buttons of the same size. */
export function JoinLinks({ className }: { className?: string }) {
  const t = useTranslations("Cta");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 max-sm:flex-col max-sm:items-stretch",
        className
      )}
    >
      <a
        className="btn-primary"
        href={COMMUNITY_LINKS.discord}
        rel="noopener noreferrer"
        target="_blank"
      >
        <DiscordIcon className="size-5" />
        {t("discord")}
      </a>
      <a
        className="btn-secondary"
        href={COMMUNITY_LINKS.whatsapp}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WhatsappIcon className="size-5" />
        {t("whatsapp")}
      </a>
    </div>
  );
}
