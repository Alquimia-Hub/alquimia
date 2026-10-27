import { ExternalLink } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CandidateView } from "@/lib/podcast/curation/queries";

function hnUrl(candidate: CandidateView): string | null {
  const value = candidate.metadata.hnUrl;
  return typeof value === "string" && value !== candidate.url ? value : null;
}

export function CandidatesTable({
  candidates,
  showPosition,
}: {
  candidates: CandidateView[];
  showPosition: boolean;
}) {
  const t = useTranslations("PodcastAdmin");
  const format = useFormatter();

  return (
    <div className="border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {showPosition && (
              <TableHead className="w-10 text-ink-3">
                {t("columnPosition")}
              </TableHead>
            )}
            <TableHead className="text-ink-3">{t("columnTitle")}</TableHead>
            <TableHead className="text-ink-3">{t("columnSource")}</TableHead>
            <TableHead className="text-right text-ink-3">
              {t("columnSignal")}
            </TableHead>
            <TableHead className="text-ink-3">{t("columnDate")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const discussion = hnUrl(candidate);
            return (
              <TableRow
                className="border-border hover:bg-surface-hover"
                data-testid={`candidate-${candidate.id}`}
                key={candidate.id}
              >
                {showPosition && (
                  <TableCell className="text-gold tabular-nums">
                    {candidate.topPosition}
                  </TableCell>
                )}
                <TableCell className="max-w-xl whitespace-normal">
                  <a
                    className="inline-flex items-start gap-1.5 text-ink transition-colors duration-200 hover:text-gold"
                    href={candidate.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {candidate.title}
                    <ExternalLink
                      aria-hidden="true"
                      className="mt-1 size-3.5 shrink-0 text-ink-3"
                    />
                  </a>
                  {discussion && (
                    <a
                      className="mt-1 block text-ink-3 text-note hover:text-gold"
                      href={discussion}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {t("hnDiscussion")}
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-ink-2 text-note">
                  {candidate.source}
                </TableCell>
                <TableCell className="text-right text-ink-2 tabular-nums">
                  {candidate.signal === null
                    ? "—"
                    : format.number(candidate.signal)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-ink-2 text-note tabular-nums">
                  {format.dateTime(candidate.publishedAt, {
                    dateStyle: "short",
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
