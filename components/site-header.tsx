import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/auth/user-menu";
import { Link } from "@/i18n/navigation";
import { HeaderLogoTrigger } from "./brand/header-logo-trigger";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { ResourcesMenu } from "./resources-menu";
import { SocialLinks } from "./social-links";

const NAV_LINK =
  "nav-link px-3 py-2 transition-colors duration-200 hover:text-gold";

export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-14 py-6 max-sm:px-4 max-md:px-6 max-md:py-4 max-lg:px-8">
      <HeaderLogoTrigger />

      <nav className="flex items-center justify-end gap-1 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 tracking-[0.3em]">
        <Link className={`${NAV_LINK} max-md:hidden`} href="/launchpad">
          {t("launchpad")}
        </Link>

        <ResourcesMenu
          className={`${NAV_LINK} flex items-center gap-1 outline-none max-md:hidden`}
        />

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:hidden" />

        <LocaleSwitcher className="max-md:hidden" />

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:hidden" />

        <SocialLinks className="max-md:hidden" />

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:hidden" />

        <UserMenu />

        <MobileNav className="md:hidden" />
      </nav>
    </header>
  );
}
