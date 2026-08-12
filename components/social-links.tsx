import { SITE_CONTENT, SOCIAL_LINKS } from "@/lib/constants";
import { GithubIcon, XIcon } from "./icons";

const SOCIALS = [
  {
    id: "github",
    href: SOCIAL_LINKS.github,
    label: SITE_CONTENT.nav.githubLabel,
    Icon: GithubIcon,
  },
  {
    id: "x",
    href: SOCIAL_LINKS.x,
    label: SITE_CONTENT.nav.xLabel,
    Icon: XIcon,
  },
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {SOCIALS.map(({ id, href, label, Icon }) => (
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
      ))}
    </div>
  );
}
