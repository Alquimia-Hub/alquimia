import { useTranslations } from "next-intl";
import { revealIndex } from "@/lib/reveal";
import { JoinLinks } from "./join-links";
import { Plate } from "./scene-picture";
import { ScrollReveal } from "./scroll-reveal";

/**
 * "Entrar es gratis": the invitation, and under it the long table of the
 * workshop with one empty chair. The headline never sits on the faces.
 */
export function ClosingSection() {
  const t = useTranslations("Closing");

  return (
    <section aria-labelledby="cierre-title" className="bg-bg">
      <ScrollReveal className="flex flex-col items-center px-[var(--gutter)] pt-[clamp(5rem,9vw,8rem)] pb-[clamp(2.5rem,4vw,3.5rem)] text-center">
        <h2
          className="m-0 font-heading font-normal text-title"
          data-reveal-item
          id="cierre-title"
          style={revealIndex(0)}
        >
          {t("title")}
        </h2>
        <p
          className="m-0 mt-5 max-w-[34ch] text-body"
          data-reveal-item
          style={revealIndex(1)}
        >
          {t("text")}
        </p>
        <div
          className="mt-9 flex justify-center max-sm:w-full max-sm:max-w-80"
          data-reveal-item
          style={revealIndex(2)}
        >
          <JoinLinks className="justify-center max-sm:w-full" />
        </div>
      </ScrollReveal>
      <Plate
        alt=""
        className="aspect-[16/9] w-full max-md:aspect-[4/3]"
        name="cierre-mesa"
        position="50% 100%"
        sizes="100vw"
      />
    </section>
  );
}
