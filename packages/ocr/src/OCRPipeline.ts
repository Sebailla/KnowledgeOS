import {
  CancellationNone,
  type Cancellation,
} from "@knowledgeos/kernel";

import type { OCRProvider } from "./contracts/OCRProvider.js";
import type { OCRLanguage } from "./model/OCRLanguage.js";
import type { OCRRegion } from "./model/OCRRegion.js";
import type { OCRResult } from "./model/OCRResult.js";
import type { OCRSource } from "./model/OCRSource.js";

export interface OCRPipelineOptions {
  readonly languages?: readonly OCRLanguage[];
  readonly regions?: readonly OCRRegion[];
  readonly cancellation?: Cancellation;
  readonly continueOnError?: boolean;
  readonly onProgress?: (
    processed: number,
    total: number,
  ) => void;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export class OCRPipeline {
  public constructor(
    private readonly provider: OCRProvider,
  ) {}

  public async execute(
    sources: readonly OCRSource[],
    options: OCRPipelineOptions = {},
  ): Promise<OCRResult> {
    const cancellation =
      options.cancellation ?? CancellationNone;

    const session =
      await this.provider.openSession();

    const documents = [];
    const failures: Array<{
      sourceId: string;
      message: string;
    }> = [];

    try {
      for (
        let index = 0;
        index < sources.length;
        index += 1
      ) {
        cancellation.throwIfCancellationRequested();

        const source = sources[index]!;

        try {
          const recognizeOptions = {
            cancellation,
            metadata: options.metadata ?? {},
            ...(options.languages !== undefined
              ? { languages: options.languages }
              : {}),
            ...(options.regions !== undefined
              ? { regions: options.regions }
              : {}),
          };

          const document =
            await session.recognize(
              source,
              recognizeOptions,
            );

          documents.push(document);
        } catch (error) {
          failures.push({
            sourceId: source.id,
            message:
              error instanceof Error
                ? error.message
                : String(error),
          });

          if (!options.continueOnError) {
            throw error;
          }
        }

        options.onProgress?.(
          index + 1,
          sources.length,
        );
      }
    } finally {
      await session.close();
    }

    return {
      documents,
      failures,
    };
  }
}
