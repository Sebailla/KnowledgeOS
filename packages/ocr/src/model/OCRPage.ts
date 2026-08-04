import type { OCRTextBlock } from "./OCRTextBlock.js";

export interface OCRPage {
  readonly pageNumber: number;
  readonly width: number;
  readonly height: number;
  readonly blocks: readonly OCRTextBlock[];
  readonly text: string;
}
