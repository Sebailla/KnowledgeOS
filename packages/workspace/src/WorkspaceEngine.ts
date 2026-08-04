import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { WorkspacePersistence } from "./contracts/WorkspacePersistence.js";
import { WorkspaceManager } from "./WorkspaceManager.js";
import { WorkspaceSession } from "./WorkspaceSession.js";

export class WorkspaceEngine implements Engine {
  public readonly id = "workspace";
  public readonly name = "Workspace Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "library",
    "search",
    "knowledge-graph",
    "ai",
  ] as const;

  public readonly manager: WorkspaceManager;

  private running = false;

  public constructor(
    persistence: WorkspacePersistence,
    now: () => string =
      () => new Date().toISOString(),
  ) {
    this.manager = new WorkspaceManager({
      persistence,
      now,
    });
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
    this.running = false;
  }

  public createSession():
  WorkspaceSession {
    if (!this.running) {
      throw new Error(
        "Workspace Engine is not running.",
      );
    }

    return new WorkspaceSession(
      this.manager,
    );
  }
}
