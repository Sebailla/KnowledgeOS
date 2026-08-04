import type { ImportDocument } from "./ImportDocument.js";
import type { ImportProgress } from "./ImportProgress.js";

export interface ImportFailure {
  readonly sourceId: string;
  readonly message: string;
}

export interface ImportResult {
  readonly imported: readonly ImportDocument[];
  readonly failures: readonly ImportFailure[];
  readonly progress: ImportProgress;
}
