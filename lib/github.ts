import { GITHUB_ORG } from "./constants";

export interface Repo {
  description: string | null;
  homepage: string | null;
  language: string | null;
  name: string;
  stars: number;
  topics: readonly string[];
  url: string;
}

export interface DisplayRepo extends Omit<Repo, "description"> {
  description: string;
}

interface GithubApiRepo {
  archived: boolean;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  html_url: string;
  language: string | null;
  name: string;
  private: boolean;
  stargazers_count: number;
  topics?: string[];
}

const CURATED_NAMES = [
  "alquimia",
  "alquimia-cli",
  "ai-payments",
  "slides",
  "videos",
  "discussions",
] as const;

export type CuratedRepoName = (typeof CURATED_NAMES)[number];

export function isCuratedRepo(name: string): name is CuratedRepoName {
  return (CURATED_NAMES as readonly string[]).includes(name);
}

const CURATED_ORDER = new Map<string, number>(
  CURATED_NAMES.map((name, index) => [name, index])
);
const HIDDEN_REPOS = new Set([".github"]);
const REVALIDATE_SECONDS = 3600;

const fallbackRepos: readonly Repo[] = CURATED_NAMES.map((name) => ({
  name,
  description: null,
  url: `https://github.com/${GITHUB_ORG}/${name}`,
  homepage: null,
  language: null,
  stars: 0,
  topics: [],
}));

function compareRepos(a: Repo, b: Repo): number {
  const orderA = CURATED_ORDER.get(a.name) ?? Number.MAX_SAFE_INTEGER;
  const orderB = CURATED_ORDER.get(b.name) ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return b.stars - a.stars;
}

function toRepo(apiRepo: GithubApiRepo): Repo {
  return {
    name: apiRepo.name,
    description: apiRepo.description,
    url: apiRepo.html_url,
    homepage: apiRepo.homepage?.trim() ? apiRepo.homepage : null,
    language: apiRepo.language,
    stars: apiRepo.stargazers_count,
    topics: (apiRepo.topics ?? []).slice(0, 3),
  };
}

export async function fetchOrgRepos(): Promise<readonly Repo[]> {
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&type=public&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!response.ok) {
      return fallbackRepos;
    }

    const data: GithubApiRepo[] = await response.json();
    const repos = data
      .filter(
        (repo) =>
          !(
            repo.private ||
            repo.fork ||
            repo.archived ||
            HIDDEN_REPOS.has(repo.name)
          )
      )
      .map(toRepo)
      .sort(compareRepos);

    return repos.length > 0 ? repos : fallbackRepos;
  } catch {
    return fallbackRepos;
  }
}
