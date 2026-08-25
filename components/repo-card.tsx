import { useTranslations } from "next-intl";
import type { DisplayRepo } from "@/lib/github";
import { GithubIcon, RepoSigil } from "./icons";

function StarCount({ stars }: { stars: number }) {
  const t = useTranslations("Repos");

  if (stars === 0) {
    return null;
  }

  return (
    <span className="flex items-center gap-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-3 tabular-nums">
      <span aria-hidden="true" className="text-gold">
        ✦
      </span>
      <span>{stars}</span>
      <span className="sr-only">{t("starsLabel")}</span>
    </span>
  );
}

export function RepoCard({
  repo,
  index,
}: {
  repo: DisplayRepo;
  index: number;
}) {
  const t = useTranslations("Repos");
  const meta = [repo.language, ...repo.topics].filter(Boolean).slice(0, 3);

  return (
    <a
      className="repo-card group flex h-full flex-col border border-rule-2 bg-bg-2/80 p-7 text-left backdrop-blur-[3px] max-md:p-6"
      href={repo.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-start justify-between">
        <RepoSigil
          className="h-9 w-9 text-gold opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          index={index}
        />
        <div className="flex items-center gap-3">
          {repo.homepage && (
            <span className="font-[family-name:var(--font-im-fell)] text-[9px] text-ink-3 uppercase tracking-[0.24em]">
              {t("liveLabel")}
            </span>
          )}
          <StarCount stars={repo.stars} />
        </div>
      </div>

      <h3 className="mt-6 mb-2.5 font-[family-name:var(--font-cormorant)] font-normal text-[1.65rem] text-ink leading-[1.1] tracking-[-0.01em] transition-colors duration-300 group-hover:text-gold">
        {repo.name}
      </h3>

      <p className="m-0 font-[family-name:var(--font-eb-garamond)] text-[15px] text-ink-3 italic leading-[1.5]">
        {repo.description}
      </p>

      {meta.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-[family-name:var(--font-im-fell)] text-[9px] text-ink-4 uppercase tracking-[0.24em]">
          {meta.map((entry, metaIndex) => (
            <span className="flex items-center gap-3" key={entry}>
              {metaIndex > 0 && (
                <span className="h-[3px] w-[3px] rotate-45 bg-ink-4" />
              )}
              <span>{entry}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-rule-2 border-t pt-5 max-md:pt-4">
        <span className="flex items-center gap-2.5 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 uppercase tracking-[0.3em] transition-colors duration-300 group-hover:text-gold">
          <GithubIcon className="h-3.5 w-3.5" />
          {t("cardCta")}
        </span>
        <span
          aria-hidden="true"
          className="font-serif text-[18px] text-gold italic transition-transform duration-300 group-hover:translate-x-1"
        >
          ⟶
        </span>
      </div>
    </a>
  );
}
