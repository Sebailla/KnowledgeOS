import type { Engine, EngineContext } from "@knowledgeos/kernel";
import type { DocumentLockManager } from "./contracts/DocumentLockManager.js";
import type { DocumentRepository } from "./contracts/DocumentRepository.js";
import { DocumentManager } from "./DocumentManager.js";
import { DocumentSession } from "./DocumentSession.js";

export class DocumentEngine implements Engine {
  public readonly id = "document";
  public readonly name = "Document Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = ["library", "storage", "search", "workspace"] as const;
  public readonly manager: DocumentManager;
  private running = false;

  public constructor(repository: DocumentRepository, private readonly locks: DocumentLockManager, now: () => string = () => new Date().toISOString()) {
    this.manager = new DocumentManager({ repository, now, checksum: simpleChecksum });
    this.now = now;
  }
  private readonly now: () => string;
  public async initialize(context: EngineContext): Promise<void> { context.cancellation.throwIfCancellationRequested(); }
  public async start(context: EngineContext): Promise<void> { context.cancellation.throwIfCancellationRequested(); this.running = true; }
  public async stop(_context: EngineContext): Promise<void> { this.running = false; }
  public async dispose(_context: EngineContext): Promise<void> { this.running = false; }
  public createSession(ownerId: string): DocumentSession {
    if (!this.running) throw new Error("Document Engine is not running.");
    return new DocumentSession(this.manager, this.locks, ownerId, this.now);
  }
}
function simpleChecksum(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
