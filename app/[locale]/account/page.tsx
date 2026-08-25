import { LayoutGrid, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AlquimistaCard } from "@/components/auth/alquimista-card";
import { AvatarPrivacyCard } from "@/components/auth/avatar-privacy-card";
import { SignInRequired } from "@/components/auth/sign-in-required";
import { BackLink } from "@/components/launchpad/back-link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { hasDiscordAccount, isBadgeStale } from "@/lib/launchpad/discord";
import { countPendingProjects } from "@/lib/launchpad/queries";
import { getViewer } from "@/lib/launchpad/session";

const readLinkState = (value: unknown): "error" | "linked" | null => {
  if (value === "linked" || value === "error") {
    return value;
  }

  return null;
};

export default async function AccountPage({
  params,
  searchParams,
}: PageProps<"/[locale]/account">) {
  await resolveLocale(params);
  const viewer = await getViewer();

  if (!viewer) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6">
          <SignInRequired callbackURL="/account" />
        </main>
      </div>
    );
  }

  const linkState = readLinkState((await searchParams).discord);

  const [t, tAdmin, discordLinked, pendingCount] = await Promise.all([
    getTranslations("Account"),
    getTranslations("Admin"),
    hasDiscordAccount(viewer.id),
    viewer.role === "admin" ? countPendingProjects() : Promise.resolve(0),
  ]);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
          <BackLink href="/launchpad" />

          <header>
            <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
              {t("title")}
            </h1>
            <p className="mt-3 mb-0 text-ink-3">{t("subtitle")}</p>
          </header>

          <AvatarPrivacyCard
            email={viewer.email}
            hideAvatar={viewer.hideAvatar}
            image={viewer.image}
            name={viewer.name}
          />

          <AlquimistaCard
            checkedAt={viewer.alquimistaCheckedAt}
            hasDiscordLinked={discordLinked}
            isAlquimista={viewer.isAlquimista}
            isStale={isBadgeStale(viewer.alquimistaCheckedAt)}
            linkState={linkState}
          />

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/launchpad/my-projects">
                <LayoutGrid className="size-4" />
                {t("myProjects")}
              </Link>
            </Button>

            {viewer.role === "admin" && (
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/launchpad">
                  <Shield className="size-4" />
                  {t("adminPanel")}
                  {pendingCount > 0 && (
                    <span
                      className="ml-1 border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-[family-name:var(--font-jetbrains)] text-[10px] text-amber-200 tabular-nums"
                      title={tAdmin("pendingBadge", { count: pendingCount })}
                    >
                      {pendingCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}
          </div>
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
