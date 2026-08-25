import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface BackLinkProps {
  href: string;
  label?: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  const t = useTranslations("Nav");

  return (
    <Link
      className="inline-flex w-fit items-center gap-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-3 uppercase tracking-[0.14em] transition-colors duration-200 hover:text-gold-2"
      data-testid="back-link"
      href={href}
    >
      <ArrowLeft aria-hidden="true" className="size-3.5" />
      {label ?? t("back")}
    </Link>
  );
}
