import Link from "next/link";
import { SITE_CONTENT } from "@/lib/constants";
import { SocialLinks } from "./social-links";

export function LandingFooter() {
  return (
    <footer
      className="flex animate-entrance animate-fade-in items-center justify-between border-rule-2 border-t px-14 py-10 font-[family-name:var(--font-eb-garamond)] text-[13px] text-ink-3 italic max-md:flex-col max-md:gap-2.5 max-md:px-5 max-md:text-center max-lg:px-8"
      style={{ "--delay": "900ms" } as React.CSSProperties}
    >
      <div>{SITE_CONTENT.footer.tagline}</div>
      <div className="flex items-center gap-5 font-[family-name:var(--font-im-fell)] text-[10px] not-italic tracking-[0.36em]">
        <Link
          className="nav-link transition-colors duration-200 hover:text-gold"
          href="/brand"
        >
          {SITE_CONTENT.footer.marca}
        </Link>
        <span>{SITE_CONTENT.footer.year}</span>
      </div>
      <div className="flex items-center gap-5 max-md:flex-col max-md:gap-2.5">
        <span>{SITE_CONTENT.footer.craft}</span>
        <SocialLinks className="-mr-2 max-md:mr-0" />
      </div>
    </footer>
  );
}
