import type { OCRProvider } from "./OCRProvider.js";

export interface AppleVisionOCRProvider
extends OCRProvider {
  readonly id: "apple-vision";
}

export interface TesseractOCRProvider
extends OCRProvider {
  readonly id: "tesseract";
}

export interface RemoteOCRProvider
extends OCRProvider {
  readonly remote: true;
}
