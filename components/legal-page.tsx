import { getTranslations } from "next-intl/server";
import { CONTACT_EMAIL } from "@/lib/constants";
import { LandingFooter } from "./landing-footer";
import { SiteHeader } from "./site-header";

type LegalNamespace = "Terms" | "Privacy";

export async function LegalPage({
  namespace,
  sections,
}: {
  namespace: LegalNamespace;
  sections: readonly string[];
}) {
  const t = await getTranslations(namespace);
  // Section ids are resolved at runtime, so keys can't be checked statically.
  const section = t as unknown as {
    (key: string): string;
    raw: (key: string) => string[];
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />

      <main className="flex-1 px-14 pt-10 pb-24 max-md:px-6 max-lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-14">
          <header className="flex animate-entrance animate-fade-up flex-col items-center gap-3 text-center">
            <span className="font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.4em]">
              {t("eyebrow")}
            </span>
            <h1
              className="text-[clamp(36px,6vw,68px)] text-ink"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {t("title")}
            </h1>
            <p className="font-[family-name:var(--font-im-fell)] text-[10px] text-ink-4 uppercase tracking-[0.32em]">
              {t("updated")}
            </p>
            <p className="mt-2 max-w-xl font-[family-name:var(--font-eb-garamond)] text-[16px] text-ink-3 italic leading-relaxed">
              {t("intro")}
            </p>
          </header>

          <div className="flex flex-col gap-12">
            {sections.map((id) => (
              <Section
                body={section.raw(`sections.${id}.body`)}
                key={id}
                title={section(`sections.${id}.title`)}
              />
            ))}

            <section className="flex flex-col gap-5">
              <SectionTitle>{t("contact.title")}</SectionTitle>
              <p className="m-0 font-[family-name:var(--font-eb-garamond)] text-[16px] text-ink-2 leading-relaxed">
                {t("contact.body")}{" "}
                <a
                  className="text-gold underline underline-offset-4 transition-colors duration-200 hover:text-gold-2"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-[family-name:var(--font-im-fell)] text-[12px] text-ink-2 uppercase tracking-[0.32em]">
        {children}
      </h2>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}

function Section({ title, body }: { title: string; body: string[] }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-4">
        {body.map((paragraph) => (
          <p
            className="m-0 font-[family-name:var(--font-eb-garamond)] text-[16px] text-ink-2 leading-relaxed"
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
