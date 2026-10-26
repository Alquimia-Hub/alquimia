export interface CurationWindow {
  end: Date;
  start: Date;
}

export interface SourceItem {
  metadata: Record<string, unknown>;
  publishedAt: Date;
  signal: number | null;
  title: string;
  url: string;
}

export interface Candidate extends SourceItem {
  source: string;
  topPosition: number | null;
}

export interface SourceError {
  message: string;
  source: string;
}

export type CurationStatus = "running" | "completed" | "failed";

export interface CurationResult {
  candidates: Candidate[];
  errors: SourceError[];
  status: Exclude<CurationStatus, "running">;
  window: CurationWindow;
}
