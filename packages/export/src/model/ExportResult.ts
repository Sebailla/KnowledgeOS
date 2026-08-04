import type { ExportArtifact } from "./ExportArtifact.js";

export interface ExportFailure {
  readonly sourceId: string;
  readonly message: string;
}

export interface ExportResult {
  readonly artifacts: readonly ExportArtifact[];
  readonly failures: readonly ExportFailure[];
}
