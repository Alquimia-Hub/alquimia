import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-quart)] focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-0 disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-gold bg-gold text-primary-foreground hover:-translate-y-px hover:border-gold-2 hover:bg-gold-2 hover:shadow-[0_6px_28px_-10px_var(--gold-2)]",
        destructive:
          "border border-destructive/50 bg-destructive/15 text-destructive hover:-translate-y-px hover:border-destructive hover:bg-destructive/25",
        outline:
          "border border-rule bg-transparent text-ink hover:-translate-y-px hover:border-gold/70 hover:bg-gold/10 hover:text-gold-2",
        secondary:
          "border border-rule-2 bg-bg-3 text-ink hover:-translate-y-px hover:border-rule hover:bg-surface-active",
        ghost:
          "border border-transparent text-ink-2 hover:border-rule-2 hover:bg-surface-hover hover:text-ink",
        link: "text-gold underline-offset-4 hover:text-gold-2 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
