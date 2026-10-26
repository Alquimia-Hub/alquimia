const TRACKING_PARAMS = new Set(["ref", "source"]);
const WWW_PREFIX = /^www\./;
const TRAILING_SLASHES = /\/+$/;
const ARXIV_PATH = /^\/(?:abs|pdf|html)\/(.+?)(?:v\d+)?(?:\.pdf)?$/;
const GIT_SUFFIX = /\.git$/;

function normalizePath(hostname: string, pathname: string): string {
  if (hostname === "arxiv.org") {
    const match = ARXIV_PATH.exec(pathname);
    if (match) {
      return `/abs/${match[1]}`;
    }
  }

  if (hostname === "github.com") {
    const [owner, repo] = pathname.split("/").filter(Boolean);
    if (owner && repo) {
      return `/${owner}/${repo.replace(GIT_SUFFIX, "")}`.toLowerCase();
    }
  }

  return pathname.replace(TRAILING_SLASHES, "");
}

/** Canonical form used to dedupe candidates across sources and runs. */
export function normalizeUrl(raw: string): string {
  const url = new URL(raw.trim());

  url.protocol = "https:";
  url.hostname = url.hostname.toLowerCase().replace(WWW_PREFIX, "");
  url.hash = "";

  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_") || TRACKING_PARAMS.has(key)) {
      url.searchParams.delete(key);
    }
  }
  url.searchParams.sort();

  return `${url.origin}${normalizePath(url.hostname, url.pathname)}${url.search}`;
}
