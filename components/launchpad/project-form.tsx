"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { createProject, updateProject } from "@/lib/launchpad/actions";
import {
  CATEGORIES,
  MAX_CATEGORIES_PER_PROJECT,
} from "@/lib/launchpad/categories";
import { PROJECT_LIMITS } from "@/lib/launchpad/constants";
import {
  normalizeUrlInput,
  OPTIONAL_LINK_FIELDS,
  type ProjectFormInput,
  type ProjectFormValues,
  projectFormSchema,
  REVIEWABLE_FIELDS,
} from "@/lib/launchpad/validation";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";
import { LogoField } from "./logo-field";
import { ReviewWarningDialog } from "./review-warning-dialog";
import { useActionError } from "./use-action-error";

const SOCIAL_LABELS: Record<(typeof OPTIONAL_LINK_FIELDS)[number], string> = {
  xUrl: "X",
  githubUrl: "GitHub",
  linkedinUrl: "LinkedIn",
  instagramUrl: "Instagram",
  tiktokUrl: "TikTok",
  discordUrl: "Discord",
};

const EMPTY_VALUES: ProjectFormInput = {
  name: "",
  tagline: "",
  description: "",
  logoUrl: "",
  websiteUrl: "",
  categoryIds: [],
  xUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  discordUrl: "",
};

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormInput>;

  isPublished?: boolean;

  projectId?: string;
}

export function ProjectForm({
  projectId,
  defaultValues,
  isPublished = false,
}: ProjectFormProps) {
  const t = useTranslations("LaunchpadForm");
  const router = useRouter();
  const translateError = useActionError();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { ...EMPTY_VALUES, ...defaultValues },
    mode: "onBlur",
  });

  const save = (values: ProjectFormValues) => {
    startTransition(async () => {
      const result = projectId
        ? await updateProject(projectId, values)
        : await createProject(values);

      if (!result.ok) {
        toast.error(translateError(result.error));
        return;
      }

      if (projectId) {
        toast.success(t("savedTitle"), {
          description:
            "requiresReview" in result.data && result.data.requiresReview
              ? t("savedBackToReview")
              : undefined,
        });
      }

      const query = projectId ? "" : "?submitted=1";
      router.push(`/launchpad/${result.data.slug}${query}`);
      router.refresh();
    });
  };

  const onSubmit = (values: ProjectFormValues) => {
    const changesContent = REVIEWABLE_FIELDS.some(
      (field) => values[field] !== (defaultValues?.[field] ?? "")
    );

    if (isPublished && changesContent) {
      setConfirmOpen(true);
      return;
    }

    save(values);
  };

  const focusFirstError = () => {
    const [firstField] = Object.keys(form.formState.errors);

    if (firstField) {
      form.setFocus(firstField as keyof ProjectFormInput);
    }
  };

  const selected = form.watch("categoryIds");
  const tagline = form.watch("tagline");
  const description = form.watch("description");

  const errorCount = Object.keys(form.formState.errors).length;
  const showSummary = form.formState.isSubmitted && errorCount > 0;

  const submitLabel = (() => {
    if (isPending) {
      return t("saving");
    }
    return projectId ? t("save") : t("submit");
  })();

  const toggleCategory = (
    categoryId: ProjectFormValues["categoryIds"][number]
  ) => {
    const next = selected.includes(categoryId)
      ? selected.filter((id) => id !== categoryId)
      : [...selected, categoryId].slice(0, MAX_CATEGORIES_PER_PROJECT);

    form.setValue("categoryIds", next, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        data-testid="project-form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("logo")}</FormLabel>
              <FormControl>
                <LogoField
                  error={fieldState.error?.message}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input
                  data-testid="field-name"
                  maxLength={PROJECT_LIMITS.name}
                  placeholder={t("namePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FieldError message={fieldState.error?.message} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-baseline justify-between gap-4">
                <FormLabel>{t("tagline")}</FormLabel>
                <CharCount max={PROJECT_LIMITS.tagline} value={tagline} />
              </div>
              <FormControl>
                <Input
                  data-testid="field-tagline"
                  maxLength={PROJECT_LIMITS.tagline}
                  placeholder={t("taglinePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FieldError message={fieldState.error?.message} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-baseline justify-between gap-4">
                <FormLabel>{t("description")}</FormLabel>
                <CharCount
                  max={PROJECT_LIMITS.description}
                  value={description}
                />
              </div>
              <FormControl>
                <Textarea
                  className="min-h-[160px]"
                  data-testid="field-description"
                  maxLength={PROJECT_LIMITS.description}
                  placeholder={t("descriptionPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FieldError message={fieldState.error?.message} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ fieldState }) => (
            <FormItem>
              <FormLabel>{t("categories")}</FormLabel>
              <FormDescription>{t("categoriesHint")}</FormDescription>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <CategoryToggle
                      active={selected.includes(category.id)}
                      categoryId={category.id}
                      key={category.id}
                      onToggle={toggleCategory}
                    />
                  ))}
                </div>
              </FormControl>
              <FieldError message={fieldState.error?.message} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("website")}</FormLabel>
              <FormControl>
                <Input
                  data-testid="field-website"
                  placeholder="https://"
                  type="url"
                  {...field}
                  onBlur={() => {
                    field.onChange(normalizeUrlInput(field.value));
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FieldError message={fieldState.error?.message} />
            </FormItem>
          )}
        />

        <fieldset className="flex flex-col gap-4 border-0 p-0">
          <legend className="mb-2 font-[family-name:var(--font-im-fell)] text-[11px] text-ink-3 uppercase tracking-[0.28em]">
            {t("socialLinks")} · {t("optional")}
          </legend>

          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {OPTIONAL_LINK_FIELDS.map((name) => (
              <FormField
                control={form.control}
                key={name}
                name={name}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{SOCIAL_LABELS[name]}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid={`field-${name}`}
                        placeholder="https://"
                        type="url"
                        {...field}
                        onBlur={() => {
                          field.onChange(normalizeUrlInput(field.value));
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FieldError message={fieldState.error?.message} />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </fieldset>

        {showSummary && (
          <div
            className="flex items-start gap-3 border border-destructive/40 bg-destructive/5 px-4 py-3"
            data-testid="form-error-summary"
            role="alert"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-destructive"
            />
            <div>
              <p className="m-0 font-medium text-destructive text-sm">
                {t("errorSummaryTitle", { count: errorCount })}
              </p>
              <p className="mt-0.5 mb-0 text-ink-3 text-sm">
                {t("errorSummaryHint")}
              </p>
              <button
                className="mt-1 bg-transparent p-0 text-destructive text-sm underline underline-offset-2"
                onClick={focusFirstError}
                type="button"
              >
                {t("errorSummaryJump")}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            data-testid="project-submit"
            disabled={isPending}
            type="submit"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button
            disabled={isPending}
            onClick={() => router.back()}
            type="button"
            variant="ghost"
          >
            {t("cancel")}
          </Button>
        </div>
      </form>

      <ReviewWarningDialog
        onConfirm={() => {
          setConfirmOpen(false);
          save(form.getValues());
        }}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        pending={isPending}
      />
    </Form>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const t = useTranslations("LaunchpadForm");
  const used = value.trim().length;

  return (
    <span
      className={cn(
        "font-[family-name:var(--font-jetbrains)] text-[10px] tabular-nums",
        used > max ? "text-destructive" : "text-ink-4"
      )}
    >
      {t("charCount", { count: used, max })}
    </span>
  );
}

function CategoryToggle({
  categoryId,
  active,
  onToggle,
}: {
  categoryId: ProjectFormValues["categoryIds"][number];
  active: boolean;
  onToggle: (id: ProjectFormValues["categoryIds"][number]) => void;
}) {
  const t = useTranslations("Launchpad.categories");

  return (
    <button
      aria-pressed={active}
      className={cn(
        "border px-3 py-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.1em] transition-colors",
        active
          ? "border-gold bg-gold/15 text-gold-2"
          : "border-rule-2 text-ink-3 hover:border-rule hover:text-ink-2"
      )}
      data-testid={`category-${categoryId}`}
      onClick={() => onToggle(categoryId)}
      type="button"
    >
      {t(categoryId)}
    </button>
  );
}
