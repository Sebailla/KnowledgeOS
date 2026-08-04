import {
  CancellationNone,
  type Cancellation,
} from "@knowledgeos/kernel";

import type { ExportWriter } from "./contracts/ExportWriter.js";
import type { ExportArtifact } from "./model/ExportArtifact.js";
import type { ExportFormat } from "./model/ExportFormat.js";
import type { ExportResult } from "./model/ExportResult.js";
import type { ExportSource } from "./model/ExportSource.js";
import { ExportTransformerRegistry } from "./registry/ExportTransformerRegistry.js";

export interface ExportPipelineOptions {
  readonly cancellation?: Cancellation;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly continueOnError?: boolean;
  readonly onProgress?: (
    processed: number,
    total: number,
  ) => void;
}

export class ExportPipeline {
  public constructor(
    private readonly registry:
      ExportTransformerRegistry,
  ) {}

  public async execute(
    sources: readonly ExportSource[],
    format: ExportFormat,
    writer: ExportWriter,
    options: ExportPipelineOptions = {},
  ): Promise<ExportResult> {
    const cancellation =
      options.cancellation ?? CancellationNone;

    const artifacts: ExportArtifact[] = [];
    const failures: Array<{
      sourceId: string;
      message: string;
    }> = [];

    const transformer =
      this.registry.get(format);

    for (
      let index = 0;
      index < sources.length;
      index += 1
    ) {
      cancellation.throwIfCancellationRequested();

      const source = sources[index]!;

      try {
        const artifact =
          await transformer.transform(
            source,
            {
              cancellation,
              metadata: options.metadata ?? {},
            },
          );

        await writer.write(artifact);
        artifacts.push(artifact);
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

    return {
      artifacts,
      failures,
    };
  }
}
