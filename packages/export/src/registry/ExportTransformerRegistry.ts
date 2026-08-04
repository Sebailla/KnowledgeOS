import type { ExportTransformer } from "../contracts/ExportTransformer.js";
import type { ExportFormat } from "../model/ExportFormat.js";
import { ExportFormatError } from "../errors/ExportFormatError.js";

export class ExportTransformerRegistry {
  private readonly transformers =
    new Map<ExportFormat, ExportTransformer>();

  public register(transformer: ExportTransformer): void {
    if (this.transformers.has(transformer.format)) {
      throw new Error(
        `Transformer for '${transformer.format}' is already registered.`,
      );
    }

    this.transformers.set(
      transformer.format,
      transformer,
    );
  }

  public get(format: ExportFormat): ExportTransformer {
    const transformer = this.transformers.get(format);

    if (!transformer) {
      throw new ExportFormatError(format);
    }

    return transformer;
  }

  public has(format: ExportFormat): boolean {
    return this.transformers.has(format);
  }
}
