import { LayoutGrid, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AlquimistaCard } from "@/components/auth/alquimista-card";
import { BackLink } from "@/components/launchpad/back-link";
import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { resolveLocale } from "@/i18n/locale";
import { Link, redirect } from "@/i18n/navigation";
import { hasDiscordAccount } from "@/lib/launchpad/discord";
import { getViewer } from "@/lib/launchpad/session";

export default async function AccountPage({
  params,
}: PageProps<"/[locale]/account">) {
  const locale = await resolveLocale(params);
  const viewer = await getViewer();

  if (!viewer) {
    redirect({ href: "/launchpad", locale });
    return null;
  }

  const [t, discordLinked] = await Promise.all([
    getTranslations("Account"),
    hasDiscordAccount(viewer.id),
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

          <section className="flex items-center gap-4 border border-rule-2 bg-bg-2/60 px-6 py-5">
            <Avatar className="size-12 border border-rule">
              <AvatarImage alt="" src={viewer.image ?? undefined} />
              <AvatarFallback className="bg-bg-3 text-ink-2">
                {viewer.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="m-0 font-medium text-ink">{viewer.name}</p>
              <p className="m-0 truncate text-ink-3 text-sm">{viewer.email}</p>
            </div>
          </section>

          <AlquimistaCard
            checkedAt={viewer.alquimistaCheckedAt}
            hasDiscordLinked={discordLinked}
            isAlquimista={viewer.isAlquimista}
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
