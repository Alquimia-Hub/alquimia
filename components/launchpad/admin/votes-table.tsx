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
      <dl className="m-0 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        {stats.map((stat) => (
          <div
            className="flex flex-col gap-1 bg-bg-2 px-5 py-4"
            key={stat.label}
          >
            <dt className="m-0 text-ink-3 text-note">{stat.label}</dt>
            <dd className="m-0 font-display font-medium text-3xl text-ink tabular-nums leading-none tracking-[-0.02em]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {votes.length === 0 ? (
        <p className="bg-bg-2 px-6 py-12 text-center text-ink-3">
          {t("votesEmpty")}
        </p>
      ) : (
        <div className="border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
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
                  className="border-border hover:bg-surface-hover"
                  data-testid={`vote-row-${vote.id}`}
                  key={vote.id}
                >
                  <TableCell className="whitespace-nowrap text-ink-2 text-note tabular-nums">
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
                        <p className="m-0 truncate text-ink-3 text-note">
                          {vote.voterEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {vote.weight >= VOTE_WEIGHT_ALQUIMISTA ? (
                      <span className="inline-flex items-center gap-1 bg-bg-3 px-1.5 py-0.5 text-gold text-note">
                        <Sparkles aria-hidden="true" className="size-3.5" />
                        {t("isAlquimista")}
                      </span>
                    ) : (
                      <span className="text-ink-3 text-note">
                        {t("notAlquimista")}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Link
                      className="text-ink-2 transition-colors duration-200 hover:text-gold"
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
                      "text-right tabular-nums",
                      vote.action === "added" ? "text-gold" : "text-ink-3"
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

          <span className="text-ink-3 text-note tabular-nums">
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
