import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { COMMUNITY_LINKS, SITE_SECTIONS, SOCIAL_LINKS } from "@/lib/constants";
import { AlquimiaLogo, GithubIcon, XIcon, YoutubeIcon } from "./icons";

const CHANNELS = [
  { key: "discord", href: COMMUNITY_LINKS.discord },
  { key: "whatsapp", href: COMMUNITY_LINKS.whatsapp },
] as const;

const SOCIALS = [
  { key: "x", href: SOCIAL_LINKS.x, Icon: XIcon },
  { key: "github", href: SOCIAL_LINKS.github, Icon: GithubIcon },
  { key: "youtube", href: SOCIAL_LINKS.youtube, Icon: YoutubeIcon },
] as const;

const MENU = [...SITE_SECTIONS, { href: "/brand", key: "brand" }] as const;

/** The close of every page: the two ways in come first and largest. */
export function LandingFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tCommon = useTranslations("Common");

  return (
    <footer className="bg-bg-2">
      <div className="section-frame flex flex-col gap-20 pb-10 max-md:gap-14">
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <ul className="m-0 flex list-none flex-col items-start gap-1 p-0">
              {CHANNELS.map((channel) => (
                <li key={channel.key}>
                  <a
                    className="nav-link block py-1 font-medium text-ink text-title transition-colors duration-150 hover:text-gold"
                    href={channel.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t(channel.key)}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="m-0 flex list-none gap-2 p-0">
              {SOCIALS.map(({ key, href, Icon }) => (
                <li key={key}>
                  <a
                    aria-label={t(key)}
                    className="grid size-12 place-items-center text-ink transition-colors duration-150 hover:bg-bg-3 hover:text-gold"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={t(key)}
                  >
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label={tNav("menu")}
            className="lg:col-span-4 lg:col-start-9"
          >
            <ul className="m-0 flex list-none flex-col items-start gap-2 p-0">
              {MENU.map((section) => (
                <li key={section.key}>
                  <Link
                    className="nav-link block py-1 text-ink text-lead transition-colors duration-150 hover:text-gold"
                    href={section.href}
                  >
                    {tNav(section.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-ink-2 text-note">
          <p className="m-0 flex items-center gap-3">
            <AlquimiaLogo className="size-7 shrink-0 text-gold" />
            {tCommon("brand")}
          </p>
          <ul className="m-0 flex list-none gap-6 p-0">
            <li>
              <Link className="link-quiet" href="/terms">
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link className="link-quiet" href="/privacy">
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
