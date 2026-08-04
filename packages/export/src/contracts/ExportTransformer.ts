import type { Cancellation } from "@knowledgeos/kernel";

import type { ExportArtifact } from "../model/ExportArtifact.js";
import type { ExportFormat } from "../model/ExportFormat.js";
import type { ExportSource } from "../model/ExportSource.js";

export interface ExportContext {
  readonly cancellation: Cancellation;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface ExportTransformer {
  readonly format: ExportFormat;

  transform(
    source: ExportSource,
    context: ExportContext,
  ): Promise<ExportArtifact>;
}
