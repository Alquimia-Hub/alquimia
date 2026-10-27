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
            <h1 className="m-0 font-display font-medium text-ink text-title tracking-[-0.02em]">
              {t("title")}
            </h1>
            <p className="m-0 text-ink-3 text-note">{t("updated")}</p>
            <p className="mt-2 mb-0 max-w-xl text-body text-ink-2">
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
              <p className="m-0 max-w-[65ch] text-body text-ink-2">
                {t("contact.body")}{" "}
                <a
                  className="text-gold underline underline-offset-4 transition-colors duration-200 hover:text-ink"
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
    <h2 className="m-0 font-display font-medium text-ink text-lead tracking-[-0.02em]">
      {children}
    </h2>
  );
}

function Section({ title, body }: { title: string; body: string[] }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-4">
        {body.map((paragraph) => (
          <p className="m-0 max-w-[65ch] text-body text-ink-2" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
