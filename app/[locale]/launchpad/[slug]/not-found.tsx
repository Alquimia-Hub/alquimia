import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function ProjectNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <div>
        <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink leading-none">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 mb-0 max-w-[46ch] text-ink-3">{t("body")}</p>
      </div>

      <Button asChild>
        <Link href="/launchpad">{t("cta")}</Link>
      </Button>
    </div>
  );
}
