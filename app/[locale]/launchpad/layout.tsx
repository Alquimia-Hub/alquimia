import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { resolveLocale } from "@/i18n/locale";

export default async function LaunchpadLayout({
  children,
  params,
}: LayoutProps<"/[locale]/launchpad">) {
  await resolveLocale(params);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-bg">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 max-md:px-4 max-md:py-6">
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
