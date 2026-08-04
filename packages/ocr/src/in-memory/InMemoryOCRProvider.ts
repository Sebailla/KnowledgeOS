import type {
  OCRProvider,
  OCRProviderCapabilities,
} from "../contracts/OCRProvider.js";
import type { OCRSession } from "../contracts/OCRSession.js";
import { InMemoryOCRSession } from "./InMemoryOCRSession.js";

export class InMemoryOCRProvider
implements OCRProvider {
  public readonly id = "in-memory";

  public readonly capabilities:
  OCRProviderCapabilities = {
    pageSegmentation: true,
    regionRecognition: true,
    languageDetection: false,
    handwritingRecognition: false,
  };

  public constructor(
    private readonly session =
      new InMemoryOCRSession(),
  ) {}

  public async openSession():
  Promise<OCRSession> {
    return this.session;
  }

  public async close(): Promise<void> {}
}
