import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The five type steps from globals.css. Without this, tailwind-merge reads
// `text-lead` as a colour and drops it next to `text-ink`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["note", "body", "lead", "title", "display"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
