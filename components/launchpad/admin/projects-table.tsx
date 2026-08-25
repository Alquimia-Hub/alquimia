"use client";

import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { CategoryChip } from "@/components/launchpad/category-chip";
import { StatusChip } from "@/components/launchpad/status-chip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@/i18n/navigation";
import { approveProjects, rejectProjects } from "@/lib/launchpad/actions";
import type { AdminProject } from "@/lib/launchpad/queries";
import { useActionError } from "../use-action-error";
import { ProjectSheet } from "./project-sheet";
import { RejectDialog } from "./reject-dialog";

const SEARCH_DEBOUNCE_MS = 300;

function pageHref(tab: string, query: string, page: number) {
  const params = new URLSearchParams({ tab });

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return `?${params.toString()}`;
}

interface ProjectsTableProps {
  page: number;
  pageCount: number;
  projects: AdminProject[];
  query: string;
  tab: string;
  total: number;
}

export function ProjectsTable({
  projects,
  page,
  pageCount,
  total,
  query: activeQuery,
  tab,
}: ProjectsTableProps) {
  const t = useTranslations("Admin");
  const format = useFormatter();
  const router = useRouter();
  const translateError = useActionError();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(activeQuery);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openProject, setOpenProject] = useState<AdminProject | null>(null);

  const [rejectTargets, setRejectTargets] = useState<string[] | null>(null);

  const pushQuery = useRef((value: string) => {
    const params = new URLSearchParams({ tab });

    if (value) {
      params.set("q", value);
    }

    router.replace(`/admin/launchpad?${params.toString()}`, { scroll: false });
  });

  useEffect(() => {
    if (query === activeQuery) {
      return;
    }

    const timeout = setTimeout(
      () => pushQuery.current(query),
      SEARCH_DEBOUNCE_MS
    );

    return () => clearTimeout(timeout);
  }, [query, activeQuery]);

  const visible = projects;

  const allVisibleSelected =
    visible.length > 0 && visible.every((project) => selected.has(project.id));

  const toggleAll = () => {
    setSelected((current) => {
      const next = new Set(current);

      for (const project of visible) {
        if (allVisibleSelected) {
          next.delete(project.id);
        } else {
          next.add(project.id);
        }
      }

      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const approve = (projectIds: string[]) => {
    startTransition(async () => {
      const result = await approveProjects({ projectIds });

      if (result.ok) {
        toast.success(t("approved", { count: result.data.approved }));
        setSelected(new Set());
        setOpenProject(null);
        router.refresh();
      } else {
        toast.error(translateError(result.error));
      }
    });
  };

  const reject = (projectIds: string[], reason: string) => {
    startTransition(async () => {
      const result = await rejectProjects({ projectIds, reason });

      if (result.ok) {
        toast.success(t("rejected", { count: result.data.rejected }));
        setSelected(new Set());
        setRejectTargets(null);
        setOpenProject(null);
        router.refresh();
      } else {
        toast.error(translateError(result.error));
      }
    });
  };

  const selectedIds = [...selected];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          aria-label={t("search")}
          className="max-w-xs border-rule bg-bg-2"
          data-testid="admin-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search")}
          type="search"
          value={query}
        />

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2" data-testid="bulk-actions">
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-gold-2 uppercase tracking-[0.12em]">
              {t("selected", { count: selectedIds.length })}
            </span>
            <Button
              data-testid="bulk-approve"
              disabled={isPending}
              onClick={() => approve(selectedIds)}
              size="sm"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              {t("approveSelected")}
            </Button>
            <Button
              data-testid="bulk-reject"
              disabled={isPending}
              onClick={() => setRejectTargets(selectedIds)}
              size="sm"
              variant="outline"
            >
              <X className="size-4" />
              {t("rejectSelected")}
            </Button>
            <Button
              onClick={() => setSelected(new Set())}
              size="sm"
              variant="ghost"
            >
              {t("clearSelection")}
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto border border-rule-2">
        <Table>
          <TableHeader>
            <TableRow className="border-rule-2 hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  aria-label={t("approveSelected")}
                  checked={allVisibleSelected}
                  data-testid="select-all"
                  disabled={visible.length === 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>{t("columnProject")}</TableHead>
              <TableHead>{t("columnAuthor")}</TableHead>
              <TableHead>{t("columnCategories")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
              <TableHead className="text-right">{t("columnVotes")}</TableHead>
              <TableHead>{t("columnDate")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell className="py-10 text-center text-ink-3" colSpan={7}>
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((project) => (
                <TableRow
                  className="cursor-pointer border-rule-2"
                  data-testid={`row-${project.slug}`}
                  key={project.id}
                  onClick={() => setOpenProject(project)}
                >
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      aria-label={project.name}
                      checked={selected.has(project.id)}
                      data-testid={`select-${project.slug}`}
                      onCheckedChange={() => toggleOne(project.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        alt=""
                        className="size-8 shrink-0 border border-rule-2 object-cover"
                        height={32}
                        src={project.logoUrl}
                        width={32}
                      />
                      <div className="min-w-0">
                        <p className="m-0 truncate font-medium text-ink">
                          {project.name}
                        </p>
                        <p className="m-0 max-w-[26ch] truncate text-ink-3 text-xs">
                          {project.tagline}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-ink-3 text-sm">
                    {project.ownerName}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.categoryIds.map((categoryId) => (
                        <CategoryChip
                          categoryId={categoryId}
                          key={categoryId}
                        />
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusChip status={project.status} />
                  </TableCell>

                  <TableCell className="text-right font-[family-name:var(--font-jetbrains)] text-ink-2 tabular-nums">
                    {project.voteScore}
                  </TableCell>

                  <TableCell className="text-ink-3 text-xs">
                    {format.dateTime(project.submittedAt ?? project.createdAt, {
                      dateStyle: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <nav className="flex items-center justify-between gap-4">
        <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-4 uppercase tracking-[0.12em]">
          {t("resultCount", { count: total })}
        </span>

        {pageCount > 1 && (
          <div className="flex items-center gap-4">
            <Button
              asChild={page > 1}
              disabled={page === 1}
              size="sm"
              variant="ghost"
            >
              {page > 1 ? (
                <a href={pageHref(tab, activeQuery, page - 1)}>
                  {t("previous")}
                </a>
              ) : (
                <span>{t("previous")}</span>
              )}
            </Button>

            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-ink-4 tabular-nums">
              {t("pageOf", { page, total: pageCount })}
            </span>

            <Button
              asChild={page < pageCount}
              disabled={page === pageCount}
              size="sm"
              variant="ghost"
            >
              {page < pageCount ? (
                <a href={pageHref(tab, activeQuery, page + 1)}>{t("next")}</a>
              ) : (
                <span>{t("next")}</span>
              )}
            </Button>
          </div>
        )}
      </nav>

      <ProjectSheet
        onApprove={(id) => approve([id])}
        onOpenChange={(open) => !open && setOpenProject(null)}
        onReject={(id) => setRejectTargets([id])}
        pending={isPending}
        project={openProject}
      />

      <RejectDialog
        count={rejectTargets?.length ?? 0}
        onConfirm={(reason) => reject(rejectTargets ?? [], reason)}
        onOpenChange={(open) => !open && setRejectTargets(null)}
        open={rejectTargets !== null}
        pending={isPending}
      />
    </div>
  );
}
