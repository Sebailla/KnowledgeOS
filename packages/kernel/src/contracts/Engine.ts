import type { Cancellation } from "../cancellation.js";

export interface EngineContext {
  readonly cancellation: Cancellation;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface Engine {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly dependencies?: readonly string[];

  initialize(context: EngineContext): Promise<void>;
  start(context: EngineContext): Promise<void>;
  stop(context: EngineContext): Promise<void>;
  dispose(context: EngineContext): Promise<void>;
}
