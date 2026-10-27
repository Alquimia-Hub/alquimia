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
      className="inline-flex w-fit items-center gap-1.5 text-ink-3 text-note transition-colors duration-200 hover:text-gold"
      data-testid="back-link"
      href={href}
    >
      <ArrowLeft aria-hidden="true" className="size-3.5" />
      {label ?? t("back")}
    </Link>
  );
}
