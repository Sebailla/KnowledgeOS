import type { ImportSource } from "../model/ImportSource.js";

export interface FormatDetector {
  detect(source: ImportSource): string;
}
