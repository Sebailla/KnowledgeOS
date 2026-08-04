import type { Cancellation } from "@knowledgeos/kernel";
import type { OCRDocument } from "../model/OCRDocument.js";
import type { OCRLanguage } from "../model/OCRLanguage.js";
import type { OCRRegion } from "../model/OCRRegion.js";
import type { OCRSource } from "../model/OCRSource.js";

export interface OCRRecognizeOptions {
  readonly languages?: readonly OCRLanguage[];
  readonly regions?: readonly OCRRegion[];
  readonly cancellation?: Cancellation;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface OCRSession {
  recognize(
    source: OCRSource,
    options?: OCRRecognizeOptions,
  ): Promise<OCRDocument>;

  close(): Promise<void>;
}
