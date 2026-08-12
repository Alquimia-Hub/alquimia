import { GITHUB_ORG, SITE_CONTENT } from "./constants";

export interface Repo {
  description: string;
  homepage: string | null;
  language: string | null;
  name: string;
  stars: number;
  topics: readonly string[];
  url: string;
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

/**
 * Curated copy for the repos whose GitHub description is empty or too terse to
 * make a friendly card. Order here is the order shown in the carousel.
 */
const CURATED: readonly {
  name: string;
  description: string;
  topics: readonly string[];
}[] = [
  {
    name: "alquimia",
    description:
      "El sitio de la comunidad. La misma página que estás mirando, abierta de punta a punta.",
    topics: ["nextjs", "sitio"],
  },
  {
    name: "alquimia-cli",
    description:
      "La comunidad en tu terminal: un comando y tenés a mano las redes, los links y las novedades.",
    topics: ["cli", "node"],
  },
  {
    name: "ai-payments",
    description:
      "Demos de agentes que pagan solos: pagos A2A, A2B y A2C sobre opBNB con el AI SDK.",
    topics: ["agentes", "cripto", "ai sdk"],
  },
  {
    name: "slides",
    description:
      "El deck con el que damos charlas: slides a pantalla completa hechas en la web, listas para reusar.",
    topics: ["slides", "charlas"],
  },
  {
    name: "videos",
    description:
      "El video promo de Alquimia, hecho 100% con código usando Remotion y la paleta de la marca.",
    topics: ["remotion", "video"],
  },
  {
    name: "discussions",
    description:
      "El foro abierto de la comunidad: preguntas, ideas y experimentos en curso.",
    topics: ["comunidad"],
  },
];

const CURATED_ORDER = new Map(CURATED.map((repo, index) => [repo.name, index]));
const HIDDEN_REPOS = new Set([".github"]);
const REVALIDATE_SECONDS = 3600;

const fallbackRepos: readonly Repo[] = CURATED.map((repo) => ({
  name: repo.name,
  description: repo.description,
  url: `https://github.com/${GITHUB_ORG}/${repo.name}`,
  homepage: null,
  language: null,
  stars: 0,
  topics: repo.topics,
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
  const curated = CURATED.find((entry) => entry.name === apiRepo.name);
  const apiTopics = apiRepo.topics ?? [];

  return {
    name: apiRepo.name,
    description:
      curated?.description ??
      apiRepo.description ??
      SITE_CONTENT.repos.emptyLabel,
    url: apiRepo.html_url,
    homepage: apiRepo.homepage?.trim() ? apiRepo.homepage : null,
    language: apiRepo.language,
    stars: apiRepo.stargazers_count,
    topics:
      apiTopics.length > 0 ? apiTopics.slice(0, 3) : (curated?.topics ?? []),
  };
}

/**
 * Public repos of the org, refreshed hourly. Falls back to the curated list so
 * the section never renders empty if the GitHub API is rate limited or down.
 */
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
