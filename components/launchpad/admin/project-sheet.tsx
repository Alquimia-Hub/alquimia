"use client";

import { Check, ExternalLink, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { CategoryChip } from "@/components/launchpad/category-chip";
import { StatusChip } from "@/components/launchpad/status-chip";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AdminProject } from "@/lib/launchpad/queries";
import { OPTIONAL_LINK_FIELDS } from "@/lib/launchpad/validation";

const LINK_LABELS: Record<(typeof OPTIONAL_LINK_FIELDS)[number], string> = {
  xUrl: "X",
  githubUrl: "GitHub",
  linkedinUrl: "LinkedIn",
  instagramUrl: "Instagram",
  tiktokUrl: "TikTok",
  discordUrl: "Discord",
};

export function ProjectSheet({
  project,
  onOpenChange,
  pending,
  onApprove,
  onReject,
}: {
  project: AdminProject | null;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const t = useTranslations("Admin");
  const format = useFormatter();

  return (
    <Sheet onOpenChange={onOpenChange} open={project !== null}>
      <SheetContent
        className="w-full overflow-y-auto border-rule bg-bg-2 sm:max-w-lg"
        data-testid="project-sheet"
      >
        {project && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <Image
                  alt=""
                  className="size-10 border border-rule-2 object-cover"
                  height={40}
                  src={project.logoUrl}
                  width={40}
                />
                {project.name}
              </SheetTitle>
              <SheetDescription>{project.tagline}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={project.status} />
                {project.categoryIds.map((categoryId) => (
                  <CategoryChip categoryId={categoryId} key={categoryId} />
                ))}
              </div>

              <section>
                <h3 className="mt-0 mb-2 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 uppercase tracking-[0.24em]">
                  {t("columnAuthor")}
                </h3>
                <p className="m-0 text-ink-2 text-sm">
                  {project.ownerName} · {project.ownerEmail}
                  {project.ownerIsAlquimista && (
                    <span className="ml-2 border border-gold/40 bg-gold/10 px-1.5 py-0.5 font-[family-name:var(--font-jetbrains)] text-[9px] text-gold-2 uppercase">
                      Alquimista
                    </span>
                  )}
                </p>
                {project.submittedAt && (
                  <p className="mt-1 mb-0 text-ink-3 text-xs">
                    {format.dateTime(project.submittedAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </section>

              <section>
                <h3 className="mt-0 mb-2 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 uppercase tracking-[0.24em]">
                  {t("reviewTitle")}
                </h3>
                <p className="m-0 whitespace-pre-wrap text-ink-2 text-sm leading-relaxed">
                  {project.description}
                </p>
              </section>

              <section>
                <h3 className="mt-0 mb-2 font-[family-name:var(--font-im-fell)] text-[10px] text-ink-3 uppercase tracking-[0.24em]">
                  Links
                </h3>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                  <li>
                    <a
                      className="inline-flex items-center gap-1.5 text-ink-2 text-sm hover:text-gold"
                      href={project.websiteUrl}
                      rel="noopener nofollow"
                      target="_blank"
                    >
                      <ExternalLink className="size-3.5" />
                      {project.websiteUrl}
                    </a>
                  </li>
                  {OPTIONAL_LINK_FIELDS.filter((field) => project[field]).map(
                    (field) => (
                      <li key={field}>
                        <a
                          className="inline-flex items-center gap-1.5 text-ink-2 text-sm hover:text-gold"
                          href={project[field] as string}
                          rel="noopener nofollow"
                          target="_blank"
                        >
                          <ExternalLink className="size-3.5" />
                          {LINK_LABELS[field]}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </section>

              <p className="m-0 font-[family-name:var(--font-jetbrains)] text-[10px] text-ink-4 uppercase tracking-[0.12em]">
                {project.reviewedByName
                  ? t("reviewedBy", { name: project.reviewedByName })
                  : t("notReviewed")}
                {project.reviewedAt
                  ? ` · ${format.dateTime(project.reviewedAt, { dateStyle: "short" })}`
                  : ""}
              </p>

              {project.rejectionReason && (
                <p className="m-0 border-red-500/40 border-l-2 pl-3 text-red-200 text-sm">
                  {project.rejectionReason}
                </p>
              )}
            </div>

            <SheetFooter className="flex-row gap-2">
              <Button
                data-testid="sheet-approve"
                disabled={pending || project.status === "approved"}
                onClick={() => onApprove(project.id)}
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                {t("approve")}
              </Button>
              <Button
                data-testid="sheet-reject"
                disabled={pending || project.status === "rejected"}
                onClick={() => onReject(project.id)}
                variant="outline"
              >
                <X className="size-4" />
                {t("reject")}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
