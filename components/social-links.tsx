import { useTranslations } from "next-intl";
import { SOCIAL_LINKS } from "@/lib/constants";
import { GithubIcon, XIcon } from "./icons";

const SOCIALS = [
  {
    id: "github",
    href: SOCIAL_LINKS.github,
    labelKey: "githubLabel",
    Icon: GithubIcon,
  },
  {
    id: "x",
    href: SOCIAL_LINKS.x,
    labelKey: "xLabel",
    Icon: XIcon,
  },
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  const t = useTranslations("Nav");

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {SOCIALS.map(({ id, href, labelKey, Icon }) => {
        const label = t(labelKey);

        return (
          <a
            aria-label={label}
            className="social-link flex h-9 w-9 items-center justify-center text-ink-3 transition-colors duration-200 hover:text-gold"
            href={href}
            key={id}
            rel="noopener noreferrer"
            target="_blank"
            title={label}
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        );
      })}
    </div>
  );
}
