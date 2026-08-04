import type { DeduplicationStore } from "./contracts/DeduplicationStore.js";
import type { FormatDetector } from "./contracts/FormatDetector.js";
import type { ImportProvider } from "./contracts/ImportProvider.js";
import type { ImportSink } from "./contracts/ImportSink.js";
import type { ImportTransformer } from "./contracts/ImportTransformer.js";
import { createFingerprint } from "./Fingerprint.js";
import { ImportValidator } from "./ImportValidator.js";
import type { ImportResult } from "./model/ImportResult.js";
import type { ImportSource } from "./model/ImportSource.js";
import { UnsupportedFormatError } from "./errors/UnsupportedFormatError.js";

export interface ImportPipelineOptions {
  readonly continueOnError?: boolean;
  readonly onProgress?: (
    progress: ImportResult["progress"],
  ) => void;
}

export class ImportPipeline {
  private readonly transformers =
    new Map<string, ImportTransformer>();

  public constructor(
    private readonly provider: ImportProvider,
    private readonly detector: FormatDetector,
    private readonly deduplication: DeduplicationStore,
    private readonly sink: ImportSink,
    private readonly validator = new ImportValidator(),
    transformers: readonly ImportTransformer[] = [],
  ) {
    for (const transformer of transformers) {
      this.transformers.set(
        transformer.format,
        transformer,
      );
    }
  }

  public register(
    transformer: ImportTransformer,
  ): void {
    this.transformers.set(
      transformer.format,
      transformer,
    );
  }

  public async run(
    sources: readonly ImportSource[],
    options: ImportPipelineOptions = {},
  ): Promise<ImportResult> {
    const imported = [];
    const failures = [];
    let completed = 0;
    let failed = 0;
    let skipped = 0;

    for (const source of sources) {
      try {
        this.validator.validate(source);

        const raw = await this.provider.read(source);
        const fingerprint =
          createFingerprint(source.id, raw);

        if (
          await this.deduplication.has(
            fingerprint,
          )
        ) {
          skipped += 1;
          completed += 1;
          options.onProgress?.({
            total: sources.length,
            completed,
            failed,
            skipped,
          });
          continue;
        }

        const format =
          this.detector.detect(source);

        const transformer =
          this.transformers.get(format);

        if (!transformer) {
          throw new UnsupportedFormatError(format);
        }

        const document =
          await transformer.transform(
            source,
            raw,
          );

        await this.sink.save(document);
        await this.deduplication.add(
          fingerprint,
        );

        imported.push(document);
        completed += 1;
      } catch (error) {
        failed += 1;
        completed += 1;

        failures.push({
          sourceId: source.id,
          message:
            error instanceof Error
              ? error.message
              : String(error),
        });

        if (options.continueOnError === false) {
          break;
        }
      }

      options.onProgress?.({
        total: sources.length,
        completed,
        failed,
        skipped,
      });
    }

    return {
      imported,
      failures,
      progress: {
        total: sources.length,
        completed,
        failed,
        skipped,
      },
    };
  }
}
