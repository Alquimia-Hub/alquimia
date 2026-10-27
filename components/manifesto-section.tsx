import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { MANIFESTO_URL } from "@/lib/constants";
import { revealIndex } from "@/lib/reveal";
import { ScrollReveal } from "./scroll-reveal";

/**
 * "Cero humo": one belief of the manifesto, word for word, opened with an
 * illuminated capital, with a link to the whole text.
 */
export function ManifestoSection() {
  const t = useTranslations("Manifesto");
  const quote = t("quote");

  return (
    <ScrollReveal
      aria-labelledby="manifiesto-title"
      as="section"
      className="section-frame scroll-mt-4"
      id="manifiesto"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
        <h2
          className="m-0 font-heading font-normal text-title lg:col-span-4"
          data-reveal-item
          id="manifiesto-title"
          style={revealIndex(0)}
        >
          {t("title")}
        </h2>
        <figure className="m-0 lg:col-span-8">
          <blockquote className="m-0" data-reveal-item style={revealIndex(1)}>
            <p className="m-0 max-w-[38ch] text-ink text-lead">
              <span className="sr-only">{quote}</span>
              <span aria-hidden="true">
                <span className="capitular">{quote.charAt(0)}</span>
                {quote.slice(1)}
              </span>
            </p>
          </blockquote>
          <figcaption
            className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4"
            data-reveal-item
            style={revealIndex(2)}
          >
            <a
              className="link-quiet inline-flex items-center gap-2 font-medium text-body text-gold"
              href={MANIFESTO_URL}
              hrefLang="es"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("link")}
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </a>
          </figcaption>
        </figure>
      </div>
    </ScrollReveal>
  );
}
