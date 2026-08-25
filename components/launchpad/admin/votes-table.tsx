import { Sparkles } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { VOTE_WEIGHT_ALQUIMISTA } from "@/lib/launchpad/constants";
import type { AdminVote } from "@/lib/launchpad/queries";
import { cn } from "@/lib/utils";

interface VotesTableProps {
  active: number;
  dayAdded: number;
  page: number;
  pageCount: number;
  votes: AdminVote[];
  weekAdded: number;
}

const pageHref = (page: number) =>
  page > 1 ? `?votes=1&page=${page}` : "?votes=1";

export function VotesTable({
  votes,
  active,
  dayAdded,
  weekAdded,
  page,
  pageCount,
}: VotesTableProps) {
  const t = useTranslations("Admin");
  const format = useFormatter();

  const stats = [
    { label: t("votesActive"), value: active },
    { label: t("votesLastDay"), value: dayAdded },
    { label: t("votesLastWeek"), value: weekAdded },
  ];

  return (
    <div className="flex flex-col gap-6">
      <dl className="m-0 grid grid-cols-3 gap-px border border-rule-2 bg-rule-2 max-sm:grid-cols-1">
        {stats.map((stat) => (
          <div
            className="flex flex-col gap-1 bg-bg-2 px-5 py-4"
            key={stat.label}
          >
            <dt className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-3 uppercase tracking-[0.14em]">
              {stat.label}
            </dt>
            <dd className="m-0 font-[family-name:var(--font-cormorant)] font-light text-3xl text-ink tabular-nums leading-none">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {votes.length === 0 ? (
        <p className="border border-rule-2 border-dashed px-6 py-12 text-center text-ink-3">
          {t("votesEmpty")}
        </p>
      ) : (
        <div className="border border-rule-2">
          <Table>
            <TableHeader>
              <TableRow className="border-rule-2 hover:bg-transparent">
                <TableHead className="text-ink-3">{t("columnWhen")}</TableHead>
                <TableHead className="text-ink-3">{t("columnVoter")}</TableHead>
                <TableHead className="text-ink-3">
                  {t("columnAlquimista")}
                </TableHead>
                <TableHead className="text-ink-3">
                  {t("columnProject")}
                </TableHead>
                <TableHead className="text-ink-3">
                  {t("columnAction")}
                </TableHead>
                <TableHead className="text-right text-ink-3">
                  {t("columnWeight")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {votes.map((vote) => (
                <TableRow
                  className="border-rule-2 hover:bg-surface-hover"
                  data-testid={`vote-row-${vote.id}`}
                  key={vote.id}
                >
                  <TableCell className="whitespace-nowrap font-[family-name:var(--font-jetbrains)] text-ink-2 text-xs tabular-nums">
                    {format.dateTime(vote.createdAt, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        className="size-7"
                        hideAvatar={vote.voterHideAvatar}
                        image={vote.voterImage}
                        name={vote.voterName}
                      />
                      <div className="min-w-0">
                        <p className="m-0 text-ink">{vote.voterName}</p>
                        <p className="m-0 truncate text-ink-3 text-xs">
                          {vote.voterEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {vote.weight >= VOTE_WEIGHT_ALQUIMISTA ? (
                      <span className="inline-flex items-center gap-1 border border-gold/50 bg-gold/10 px-1.5 py-0.5 font-[family-name:var(--font-jetbrains)] text-[9px] text-gold-2 uppercase tracking-[0.1em]">
                        <Sparkles
                          aria-hidden="true"
                          className="size-3 fill-gold/40"
                        />
                        {t("isAlquimista")}
                      </span>
                    ) : (
                      <span className="text-ink-3 text-xs">
                        {t("notAlquimista")}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Link
                      className="text-ink-2 transition-colors duration-200 hover:text-gold-2"
                      href={`/launchpad/${vote.projectSlug}`}
                    >
                      {vote.projectName}
                    </Link>
                  </TableCell>

                  <TableCell className="text-ink-2 text-sm">
                    {vote.action === "added"
                      ? t("actionAdded")
                      : t("actionRemoved")}
                  </TableCell>

                  <TableCell
                    className={cn(
                      "text-right font-[family-name:var(--font-jetbrains)] tabular-nums",
                      vote.action === "added" ? "text-gold-2" : "text-ink-3"
                    )}
                  >
                    {vote.action === "added" ? "+" : "−"}
                    {vote.weight}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-4">
          <Button
            asChild={page > 1}
            disabled={page === 1}
            size="sm"
            variant="ghost"
          >
            {page > 1 ? (
              <a href={pageHref(page - 1)}>{t("previous")}</a>
            ) : (
              <span>{t("previous")}</span>
            )}
          </Button>

          <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-3 tabular-nums">
            {t("pageOf", { page, total: pageCount })}
          </span>

          <Button
            asChild={page < pageCount}
            disabled={page === pageCount}
            size="sm"
            variant="ghost"
          >
            {page < pageCount ? (
              <a href={pageHref(page + 1)}>{t("next")}</a>
            ) : (
              <span>{t("next")}</span>
            )}
          </Button>
        </nav>
      )}
    </div>
  );
}
