import type { ExportFormat } from "./ExportFormat.js";

export type ExportJobState =
  | "queued"
  | "running"
  | "completed"
  | "completed-with-errors"
  | "failed"
  | "cancelled";

export interface ExportJob {
  readonly id: string;
  readonly format: ExportFormat;
  readonly createdAt: string;
  readonly state: ExportJobState;
  readonly processed: number;
  readonly total: number;
  readonly errors: readonly string[];
}
