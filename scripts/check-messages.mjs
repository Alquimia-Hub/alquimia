import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const LOCALES = ["es", "en"];
const SOURCE_DIRS = ["app", "components", "lib", "i18n"];

const NAMESPACE_PATTERN =
  /(?:useTranslations|getTranslations)\(\s*(?:\{[^}]*namespace:\s*)?["']([\w.]+)["']/g;
const CALL_PATTERN = /\bt(?:[A-Z]\w*)?\(\s*["']([\w.-]+)["']/g;

const messages = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")),
  ])
);

const resolvesToString = (tree, dottedPath) => {
  let current = tree;

  for (const part of dottedPath.split(".")) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return false;
    }
    current = current[part];
  }

  return typeof current === "string";
};

const flatten = (tree, prefix = "") => {
  const keys = new Set();

  for (const [key, value] of Object.entries(tree)) {
    const full = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      for (const nested of flatten(value, full)) {
        keys.add(nested);
      }
    } else {
      keys.add(full);
    }
  }

  return keys;
};

const sourceFiles = (dir) => {
  const found = [];

  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);

    if (statSync(full).isDirectory()) {
      found.push(...sourceFiles(full));
    } else if (full.endsWith(".tsx") || full.endsWith(".ts")) {
      found.push(full);
    }
  }

  return found;
};

const problems = [];

for (const dir of SOURCE_DIRS) {
  for (const file of sourceFiles(dir)) {
    const source = readFileSync(file, "utf8");
    const namespaces = [...source.matchAll(NAMESPACE_PATTERN)].map((m) => m[1]);

    if (namespaces.length === 0) {
      continue;
    }

    for (const [, key] of source.matchAll(CALL_PATTERN)) {
      const resolves = namespaces.some((namespace) =>
        resolvesToString(messages.es, `${namespace}.${key}`)
      );

      if (!resolves) {
        problems.push(
          `${file}: "${key}" (namespaces: ${namespaces.join(", ")})`
        );
      }
    }
  }
}

const [es, en] = LOCALES.map((locale) => flatten(messages[locale]));
const onlyEs = [...es].filter((key) => !en.has(key));
const onlyEn = [...en].filter((key) => !es.has(key));

for (const key of onlyEs) {
  problems.push(`falta en en.json: ${key}`);
}
for (const key of onlyEn) {
  problems.push(`falta en es.json: ${key}`);
}

if (problems.length > 0) {
  process.stderr.write(
    `Mensajes con problemas:\n${problems.map((p) => `  ${p}`).join("\n")}\n`
  );
  process.exit(1);
}

process.stdout.write("Mensajes OK\n");
