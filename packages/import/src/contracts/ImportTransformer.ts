import type { ImportDocument } from "../model/ImportDocument.js";
import type { ImportSource } from "../model/ImportSource.js";

export interface ImportTransformer {
  readonly format: string;
  transform(
    source: ImportSource,
    raw: string,
  ): Promise<ImportDocument>;
}
