"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LOGO_SIZE_PX } from "@/lib/launchpad/constants";
import { resizeToSquareWebp } from "@/lib/launchpad/resize-image";
import { FieldError } from "./field-error";

interface LogoFieldProps {
  error?: string;
  onChange: (url: string) => void;
  value: string;
}

export function LogoField({ value, onChange, error }: LogoFieldProps) {
  const t = useTranslations("LaunchpadForm");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);

    try {
      const resized = await resizeToSquareWebp(file);
      const body = new FormData();
      body.append("file", resized);

      const response = await fetch("/api/launchpad/logo", {
        method: "POST",
        body,
      });

      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!(response.ok && payload.url)) {
        toast.error(payload.error ?? t("errorGeneric"));
        return;
      }

      onChange(payload.url);
    } catch {
      toast.error(t("errorGeneric"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex size-20 shrink-0 items-center justify-center border border-rule bg-bg-2">
        {value ? (
          <Image
            alt=""
            className="size-full object-cover"
            height={LOGO_SIZE_PX}
            src={value}
            width={LOGO_SIZE_PX}
          />
        ) : (
          <ImagePlus aria-hidden="true" className="size-6 text-ink-4" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          data-testid="logo-input"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (file) {
              await handleFile(file);
            }
          }}
          ref={inputRef}
          type="file"
        />

        <Button
          data-testid="logo-select"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          size="sm"
          type="button"
          variant="outline"
        >
          {uploading && <Loader2 className="size-4 animate-spin" />}
          {value ? t("logoChange") : t("logoSelect")}
        </Button>

        <p className="m-0 text-ink-4 text-xs">{t("logoHint")}</p>
        <FieldError message={error} />
      </div>
    </div>
  );
}
