import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for `next/link` and `next/navigation`. Always use
 * these for internal links so the `/en` prefix is kept while browsing.
 */
export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
