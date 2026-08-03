import type { StorageCapabilities } from "../contracts/StorageCapabilities.js";
import type { StorageProvider } from "../contracts/StorageProvider.js";
import type { StorageSession } from "../contracts/StorageSession.js";
import type { StorageRecord } from "../contracts/StorageRecord.js";
import { InMemoryStorageSession } from "./InMemoryStorageSession.js";

export class InMemoryStorageProvider
implements StorageProvider {
  public readonly id = "in-memory";

  public readonly capabilities: StorageCapabilities = {
    transactions: true,
    migrations: true,
    optimisticConcurrency: true,
    snapshots: true,
    streaming: false,
  };

  private readonly records =
    new Map<string, StorageRecord<unknown>>();

  private closed = false;

  public async openSession(): Promise<StorageSession> {
    if (this.closed) {
      throw new Error("Storage provider is closed.");
    }

    return new InMemoryStorageSession(this.records);
  }

  public async close(): Promise<void> {
    this.closed = true;
  }
}
