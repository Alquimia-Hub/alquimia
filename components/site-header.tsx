import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/auth/user-menu";
import { Link } from "@/i18n/navigation";
import { SITE_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HeaderLogoTrigger } from "./brand/header-logo-trigger";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

/**
 * Flat bar: wordmark, the four places, language and sign-in. On the home page
 * it lies over the hero scene (`overlay`) and scrolls away with it.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const t = useTranslations("Nav");

  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between gap-6 px-[var(--gutter)] py-5",
        overlay ? "absolute inset-x-0 top-0" : "relative bg-bg"
      )}
    >
      <HeaderLogoTrigger />

      <div className="flex items-center gap-2 text-ink">
        <nav aria-label={t("main")} className="max-lg:hidden">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {SITE_SECTIONS.map((section) => (
              <li key={section.key}>
                <Link
                  className="nav-link block px-3 py-2 font-medium text-note hover:text-gold"
                  href={section.href}
                >
                  {t(section.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LocaleSwitcher className="max-lg:hidden" />
        <UserMenu />
        <MobileNav className="lg:hidden" />
      </div>
    </header>
  );
}
