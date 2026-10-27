"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    theme="dark"
    toastOptions={{
      classNames: {
        toast:
          "rounded-none! border! border-border! bg-bg-2! text-ink! text-sm!",
        description: "text-ink-3! text-sm!",
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
