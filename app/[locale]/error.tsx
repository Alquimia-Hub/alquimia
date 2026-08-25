"use client";

import { Loader2, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const retry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <div>
        <h1 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-4xl text-ink leading-none">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 mb-0 max-w-[46ch] text-ink-3">{t("body")}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button disabled={isPending} onClick={retry}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RotateCw className="size-4" />
          )}
          {t("retry")}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-4 uppercase tracking-[0.14em]">
          {t("digest")}: {error.digest}
        </p>
      )}
    </main>
  );
}
