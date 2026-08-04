import {
  CancellationNone,
} from "@knowledgeos/kernel";

import type {
  OCRRecognizeOptions,
  OCRSession,
} from "../contracts/OCRSession.js";
import type { OCRDocument } from "../model/OCRDocument.js";
import type { OCRSource } from "../model/OCRSource.js";

export class InMemoryOCRSession
implements OCRSession {
  public async recognize(
    source: OCRSource,
    options: OCRRecognizeOptions = {},
  ): Promise<OCRDocument> {
    const cancellation =
      options.cancellation ?? CancellationNone;

    cancellation.throwIfCancellationRequested();

    const text = decodeUtf8(source.content);

    return {
      sourceId: source.id,
      pages: [
        {
          pageNumber: 1,
          width: 1000,
          height: 1400,
          blocks: [
            {
              id: `${source.id}:block:1`,
              text,
              confidence: 1,
              region: {
                x: 0,
                y: 0,
                width: 1000,
                height: 1400,
              },
              language:
                options.languages?.[0] ?? "auto",
            },
          ],
          text,
        },
      ],
      text,
      metadata: {
        ...source.metadata,
        provider: "in-memory",
      },
    };
  }

  public async close(): Promise<void> {}
}

function decodeUtf8(
  bytes: Uint8Array,
): string {
  let result = "";

  for (const byte of bytes) {
    result += String.fromCharCode(byte);
  }

  return result;
}
