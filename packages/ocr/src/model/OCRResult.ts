import type { OCRDocument } from "./OCRDocument.js";

export interface OCRFailure {
  readonly sourceId: string;
  readonly message: string;
}

export interface OCRResult {
  readonly documents: readonly OCRDocument[];
  readonly failures: readonly OCRFailure[];
}
