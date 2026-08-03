import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { StorageProvider } from "./contracts/StorageProvider.js";

export class StorageEngine implements Engine {
  public readonly id = "storage";
  public readonly name = "Storage Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [] as const;

  private initialized = false;
  private started = false;

  public constructor(
    public readonly provider: StorageProvider,
  ) {}

  public async initialize(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();
    this.initialized = true;
  }

  public async start(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();

    if (!this.initialized) {
      throw new Error(
        "Storage Engine must be initialized before start.",
      );
    }

    this.started = true;
  }

  public async stop(
    _context: EngineContext,
  ): Promise<void> {
    this.started = false;
  }

  public async dispose(
    _context: EngineContext,
  ): Promise<void> {
    await this.provider.close();
    this.initialized = false;
    this.started = false;
  }

  public get isRunning(): boolean {
    return this.started;
  }
}
