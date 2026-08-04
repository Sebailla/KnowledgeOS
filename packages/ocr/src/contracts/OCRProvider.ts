import type { OCRSession } from "./OCRSession.js";

export interface OCRProviderCapabilities {
  readonly pageSegmentation: boolean;
  readonly regionRecognition: boolean;
  readonly languageDetection: boolean;
  readonly handwritingRecognition: boolean;
}

export interface OCRProvider {
  readonly id: string;
  readonly capabilities: OCRProviderCapabilities;

  openSession(): Promise<OCRSession>;
  close(): Promise<void>;
}
