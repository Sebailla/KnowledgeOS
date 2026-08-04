import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { ExportProvider } from "./contracts/ExportProvider.js";
import type { ExportFormat } from "./model/ExportFormat.js";
import type { ExportResult } from "./model/ExportResult.js";
import type { ExportSource } from "./model/ExportSource.js";
import {
  ExportPipeline,
  type ExportPipelineOptions,
} from "./ExportPipeline.js";
import { ExportTransformerRegistry } from "./registry/ExportTransformerRegistry.js";
import { MarkdownExportTransformer } from "./transformers/MarkdownExportTransformer.js";
import { HtmlExportTransformer } from "./transformers/HtmlExportTransformer.js";
import { PdfExportTransformer } from "./transformers/PdfExportTransformer.js";
import { EpubExportTransformer } from "./transformers/EpubExportTransformer.js";

export class ExportEngine implements Engine {
  public readonly id = "export";
  public readonly name = "Export Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "library",
    "storage",
  ] as const;

  private running = false;
  private readonly registry =
    new ExportTransformerRegistry();
  private readonly pipeline =
    new ExportPipeline(this.registry);

  public constructor(
    private readonly provider: ExportProvider,
  ) {
    this.registry.register(
      new MarkdownExportTransformer(),
    );
    this.registry.register(
      new HtmlExportTransformer(),
    );
    this.registry.register(
      new PdfExportTransformer(),
    );
    this.registry.register(
      new EpubExportTransformer(),
    );
  }

  public async initialize(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();
  }

  public async start(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();
    this.running = true;
  }

  public async stop(
    _context: EngineContext,
  ): Promise<void> {
    this.running = false;
  }

  public async dispose(
    _context: EngineContext,
  ): Promise<void> {
    await this.provider.close();
    this.running = false;
  }

  public registerTransformer(
    transformer: Parameters<
      ExportTransformerRegistry["register"]
    >[0],
  ): void {
    this.registry.register(transformer);
  }

  public async export(
    sources: readonly ExportSource[],
    format: ExportFormat,
    options: ExportPipelineOptions = {},
  ): Promise<ExportResult> {
    if (!this.running) {
      throw new Error(
        "Export Engine is not running.",
      );
    }

    const writer =
      await this.provider.openWriter();

    return this.pipeline.execute(
      sources,
      format,
      writer,
      options,
    );
  }
}
