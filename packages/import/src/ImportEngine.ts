import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type {
  ImportPipeline,
  ImportPipelineOptions,
} from "./ImportPipeline.js";
import type { ImportResult } from "./model/ImportResult.js";
import type { ImportSource } from "./model/ImportSource.js";

export class ImportEngine implements Engine {
  public readonly id = "import";
  public readonly name = "Import Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "storage",
    "library",
    "search",
    "knowledge-graph",
  ] as const;

  private running = false;

  public constructor(
    private readonly pipeline: ImportPipeline,
  ) {}

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
    this.running = false;
  }

  public async import(
    sources: readonly ImportSource[],
    options?: ImportPipelineOptions,
  ): Promise<ImportResult> {
    if (!this.running) {
      throw new Error(
        "Import Engine is not running.",
      );
    }

    return this.pipeline.run(
      sources,
      options,
    );
  }
}
