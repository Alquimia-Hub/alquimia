"use client";

import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { CATEGORIES } from "@/lib/launchpad/categories";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

export function ProjectFilters() {
  const t = useTranslations("Launchpad");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "votes";
  const activeQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(activeQuery);

  const push = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const pushRef = useRef(push);
  pushRef.current = push;

  useEffect(() => {
    if (query === activeQuery) {
      return;
    }

    const timeout = setTimeout(
      () => pushRef.current({ q: query || null }),
      SEARCH_DEBOUNCE_MS
    );

    return () => clearTimeout(timeout);
  }, [query, activeQuery]);

  const hasFilters = Boolean(query || category || sort !== "votes");

  return (
    <div className={cn("flex flex-col gap-4", isPending && "opacity-70")}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-4"
          />
          <Input
            aria-label={t("searchLabel")}
            className="border-rule bg-bg-2 pl-9 text-ink placeholder:text-ink-4"
            data-testid="launchpad-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            type="search"
            value={query}
          />
        </div>

        <Select
          onValueChange={(value) =>
            push({ sort: value === "votes" ? null : value })
          }
          value={sort}
        >
          <SelectTrigger
            aria-label={t("sortLabel")}
            className="w-[180px] border-rule bg-bg-2"
            data-testid="launchpad-sort"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">{t("sortVotes")}</SelectItem>
            <SelectItem value="recent">{t("sortRecent")}</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            data-testid="launchpad-clear-filters"
            onClick={() => {
              setQuery("");
              push({ q: null, category: null, sort: null });
            }}
            size="sm"
            variant="ghost"
          >
            <X className="size-4" />
            {t("clearFilters")}
          </Button>
        )}
      </div>

      <fieldset className="flex flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">{t("filterByCategory")}</legend>
        <CategoryButton
          active={!category}
          label={t("allCategories")}
          onClick={() => push({ category: null })}
        />
        {CATEGORIES.map((item) => (
          <CategoryButton
            active={category === item.id}
            key={item.id}
            label={t(`categories.${item.id}`)}
            onClick={() =>
              push({ category: category === item.id ? null : item.id })
            }
          />
        ))}
      </fieldset>
    </div>
  );
}

function CategoryButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "border px-3 py-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.1em] transition-colors",
        active
          ? "border-gold bg-gold/15 text-gold-2"
          : "border-rule-2 text-ink-3 hover:border-rule hover:text-ink-2"
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
