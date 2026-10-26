import { XMLParser } from "fast-xml-parser";

const USER_AGENT = "alquimia-podcast-curation (+https://alquimia.community)";

async function request(
  url: string,
  signal: AbortSignal,
  headers: Record<string, string>
): Promise<Response> {
  const response = await fetch(url, {
    signal,
    headers: { "User-Agent": USER_AGENT, ...headers },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} (${url})`);
  }

  return response;
}

export async function fetchJson<T>(
  url: string,
  signal: AbortSignal,
  headers: Record<string, string> = {}
): Promise<T> {
  const response = await request(url, signal, {
    Accept: "application/json",
    ...headers,
  });
  return (await response.json()) as T;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => ["entry", "item", "author", "link"].includes(name),
});

export async function fetchXml<T>(
  url: string,
  signal: AbortSignal
): Promise<T> {
  const response = await request(url, signal, {});
  return xmlParser.parse(await response.text()) as T;
}

const WHITESPACE = /\s+/g;

/** XML text nodes can come back as numbers or objects with attributes. */
export function text(value: unknown): string {
  if (typeof value === "object" && value !== null && "#text" in value) {
    return text((value as { "#text": unknown })["#text"]);
  }
  return value === undefined || value === null
    ? ""
    : String(value).replace(WHITESPACE, " ").trim();
}

export function inWindow(
  date: Date,
  window: { end: Date; start: Date }
): boolean {
  const time = date.getTime();
  return time >= window.start.getTime() && time <= window.end.getTime();
}

export const byDateDesc = (
  a: { publishedAt: Date },
  b: { publishedAt: Date }
) => b.publishedAt.getTime() - a.publishedAt.getTime();
