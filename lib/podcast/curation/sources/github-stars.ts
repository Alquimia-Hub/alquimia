import type { SourceConfig } from "../config";
import type { CurationWindow, SourceItem } from "../types";
import { fetchJson, inWindow } from "./http";

interface StarredRepo {
  repo: {
    description: string | null;
    full_name: string;
    html_url: string;
    language: string | null;
    stargazers_count: number;
  };
  starred_at: string;
}

const PER_PAGE = 100;
const MAX_PAGES = 5;

export async function fetchGithubStars(
  config: Extract<SourceConfig, { kind: "github-stars" }>,
  window: CurationWindow,
  signal: AbortSignal
): Promise<SourceItem[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github.star+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const items: SourceItem[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const stars = await fetchJson<StarredRepo[]>(
      `https://api.github.com/users/${encodeURIComponent(config.user)}/starred?sort=created&direction=desc&per_page=${PER_PAGE}&page=${page}`,
      signal,
      headers
    );

    for (const star of stars) {
      const starredAt = new Date(star.starred_at);
      if (inWindow(starredAt, window)) {
        items.push({
          url: star.repo.html_url,
          title: star.repo.full_name,
          publishedAt: starredAt,
          signal: star.repo.stargazers_count,
          metadata: {
            description: star.repo.description,
            language: star.repo.language,
          },
        });
      }
    }

    const oldest = stars.at(-1);
    if (
      stars.length < PER_PAGE ||
      !oldest ||
      new Date(oldest.starred_at) < window.start
    ) {
      break;
    }
  }

  return items;
}
