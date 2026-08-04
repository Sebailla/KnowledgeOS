import type { OCRPage } from "./OCRPage.js";

export interface OCRDocument {
  readonly sourceId: string;
  readonly pages: readonly OCRPage[];
  readonly text: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}
