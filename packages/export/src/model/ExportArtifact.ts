import type { ExportFormat } from "./ExportFormat.js";

export interface ExportArtifact {
  readonly id: string;
  readonly format: ExportFormat;
  readonly mediaType: string;
  readonly fileName: string;
  readonly content: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
