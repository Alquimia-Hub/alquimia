import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeaderLogoTrigger } from "./brand/header-logo-trigger";
import { LocaleSwitcher } from "./locale-switcher";
import { SocialLinks } from "./social-links";

export function LandingHeader() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");

  return (
    <header
      className="grid animate-entrance animate-fade-in grid-cols-[1fr_auto_1fr] items-center px-14 py-7 max-md:grid-cols-[1fr_auto] max-md:px-6 max-md:py-5 max-lg:px-8"
      style={{ "--delay": "900ms" } as React.CSSProperties}
    >
      {/* Brand */}
      <HeaderLogoTrigger />

      {/* Center - Year */}
      <div className="flex items-center justify-center gap-3.5 text-center font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 tracking-[0.4em] max-md:hidden">
        <span className="h-1 w-1 rotate-45 bg-gold" />
        <span>{tCommon("year")}</span>
        <span className="h-1 w-1 rotate-45 bg-gold" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-end gap-1 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 tracking-[0.3em]">
        <Link
          className="nav-link px-3 py-2 transition-colors duration-200 hover:text-gold max-sm:hidden"
          href="/#repos"
        >
          {t("repos")}
        </Link>
        <Link
          className="nav-link px-3 py-2 transition-colors duration-200 hover:text-gold max-sm:hidden"
          href="/#charlas"
        >
          {t("talks")}
        </Link>
        <Link
          className="nav-link px-3 py-2 transition-colors duration-200 hover:text-gold"
          href="/brand"
        >
          {t("brand")}
        </Link>

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:mx-1" />

        <LocaleSwitcher />

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:mx-1" />

        <SocialLinks />
      </nav>
    </header>
  );
}
