import type { OCRRegion } from "./OCRRegion.js";

export interface OCRTextBlock {
  readonly id: string;
  readonly text: string;
  readonly confidence: number;
  readonly region: OCRRegion;
  readonly language?: string;
}
