import { ScrollReveal } from "./scroll-reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <ScrollReveal className="flex flex-col items-center text-center">
      <div className="mb-4 flex items-center gap-4 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.42em] max-md:gap-2.5 max-md:tracking-[0.3em]">
        <span className="h-px w-14 bg-rule max-md:w-7" />
        <span className="h-[5px] w-[5px] rotate-45 bg-gold" />
        <span>{eyebrow}</span>
        <span className="h-[5px] w-[5px] rotate-45 bg-gold" />
        <span className="h-px w-14 bg-rule max-md:w-7" />
      </div>

      <h2 className="m-0 font-[family-name:var(--font-cormorant)] font-light text-[clamp(2.25rem,4vw+0.5rem,3.75rem)] text-ink leading-[1] tracking-[-0.02em]">
        {title}
      </h2>

      <p className="mt-4 mb-0 max-w-[560px] font-[family-name:var(--font-cormorant)] font-light text-[clamp(1rem,1.1vw+0.5rem,1.25rem)] text-ink-3 italic leading-[1.45]">
        {subtitle}
      </p>
    </ScrollReveal>
  );
}
