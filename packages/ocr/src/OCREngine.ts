import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { OCRProvider } from "./contracts/OCRProvider.js";
import {
  OCRPipeline,
  type OCRPipelineOptions,
} from "./OCRPipeline.js";
import type { OCRResult } from "./model/OCRResult.js";
import type { OCRSource } from "./model/OCRSource.js";

export class OCREngine implements Engine {
  public readonly id = "ocr";
  public readonly name = "OCR Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "storage",
    "import",
  ] as const;

  private running = false;
  private readonly pipeline: OCRPipeline;

  public constructor(
    private readonly provider: OCRProvider,
  ) {
    this.pipeline =
      new OCRPipeline(provider);
  }

  public async initialize(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation
      .throwIfCancellationRequested();
  }

  public async start(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation
      .throwIfCancellationRequested();

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

  public async recognize(
    sources: readonly OCRSource[],
    options: OCRPipelineOptions = {},
  ): Promise<OCRResult> {
    if (!this.running) {
      throw new Error(
        "OCR Engine is not running.",
      );
    }

    return this.pipeline.execute(
      sources,
      options,
    );
  }
}
