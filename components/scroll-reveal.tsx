"use client";

import { useEffect, useRef } from "react";

/**
 * Lets the parts of a section (marked with `data-reveal-item` and an index in
 * `--i`) rise in a short stagger the first time the section enters the
 * viewport. Content is visible by default: it is only hidden once this script
 * has run and found the section still below the fold.
 */
export function ScrollReveal({
  children,
  className,
  id,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "section" | "footer";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;

    if (
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      el.getBoundingClientRect().top < window.innerHeight
    ) {
      return;
    }

    el.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      className={className}
      data-reveal=""
      id={id}
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
