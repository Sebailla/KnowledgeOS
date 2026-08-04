import type { ImportDocument } from "../model/ImportDocument.js";

export interface ImportSink {
  save(document: ImportDocument): Promise<void>;
}
