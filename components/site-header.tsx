import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/auth/user-menu";
import { Link } from "@/i18n/navigation";
import { HeaderLogoTrigger } from "./brand/header-logo-trigger";
import { LocaleSwitcher } from "./locale-switcher";
import { ResourcesMenu } from "./resources-menu";
import { SocialLinks } from "./social-links";

const NAV_LINK =
  "nav-link px-3 py-2 transition-colors duration-200 hover:text-gold";

export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header className="grid grid-cols-[1fr_auto] items-center px-14 py-6 max-md:px-6 max-md:py-4 max-lg:px-8">
      <HeaderLogoTrigger />

      <nav className="flex items-center justify-end gap-1 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 tracking-[0.3em]">
        <Link className={NAV_LINK} href="/launchpad">
          {t("launchpad")}
        </Link>

        <ResourcesMenu
          className={`${NAV_LINK} flex items-center gap-1 outline-none`}
        />

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:mx-1" />

        <LocaleSwitcher />

        <span className="mx-2 h-4 w-px bg-rule-2 max-md:mx-1" />

        <SocialLinks className="max-sm:hidden" />

        <span className="mx-2 h-4 w-px bg-rule-2 max-sm:hidden" />

        <UserMenu />
      </nav>
    </header>
  );
}
