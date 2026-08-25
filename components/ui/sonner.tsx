"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    theme="dark"
    toastOptions={{
      classNames: {
        toast:
          "rounded-none! border! border-rule! bg-bg-2! text-ink! font-[family-name:var(--font-eb-garamond)]! shadow-[0_20px_50px_-30px_black]!",
        description: "text-ink-3!",
        actionButton: "bg-gold! text-primary-foreground!",
        cancelButton: "bg-bg-3! text-ink-2!",
        error: "border-destructive/50!",
        success: "border-gold/50!",
      },
    }}
    {...props}
  />
);

export { Toaster };
