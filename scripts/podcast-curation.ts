import { parseArgs } from "node:util";
import { runCuration } from "@/lib/podcast/curation/run";
import type { Candidate } from "@/lib/podcast/curation/types";

const { values } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    days: { type: "string" },
  },
});

const print = (line = "") => process.stdout.write(`${line}\n`);

const formatDate = (date: Date) =>
  date.toISOString().slice(0, 16).replace("T", " ");

const URL_INDENT = " ".repeat(34);

const row = (candidate: Candidate) =>
  [
    String(candidate.topPosition ?? "").padStart(2),
    candidate.source.padEnd(12),
    String(candidate.signal ?? "—").padStart(6),
    formatDate(candidate.publishedAt).slice(0, 10),
    `${candidate.title.slice(0, 80)}\n${URL_INDENT}${candidate.url}`,
  ].join("  ");

async function main() {
  const days = values.days === undefined ? undefined : Number(values.days);
  if (days !== undefined && !(days > 0)) {
    throw new Error("--days tiene que ser un número mayor a 0");
  }

  const { result, runId } = await runCuration({
    days,
    dryRun: values["dry-run"],
  });

  print(
    `Ventana: ${formatDate(result.window.start)} → ${formatDate(result.window.end)} (UTC)`
  );
  print(
    runId
      ? `Corrida guardada: ${runId} (${result.status})`
      : "Dry run: no se escribió en la base"
  );

  for (const error of result.errors) {
    print(`⚠ ${error.source} falló: ${error.message}`);
  }

  const top = result.candidates
    .filter((candidate) => candidate.topPosition !== null)
    .sort((a, b) => (a.topPosition ?? 0) - (b.topPosition ?? 0));
  const rest = result.candidates.filter(
    (candidate) => candidate.topPosition === null
  );

  print(`\nTop ${top.length}`);
  for (const candidate of top) {
    print(row(candidate));
  }

  const counts = Object.entries(
    Object.groupBy(rest, (candidate) => candidate.source)
  ).map(([source, items]) => `${source}: ${items?.length ?? 0}`);
  print(`\nResto: ${rest.length} candidatos (${counts.join(", ")})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  });
