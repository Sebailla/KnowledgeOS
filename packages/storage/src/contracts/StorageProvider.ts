import type { StorageCapabilities } from "./StorageCapabilities.js";
import type { StorageSession } from "./StorageSession.js";

export interface StorageProvider {
  readonly id: string;
  readonly capabilities: StorageCapabilities;

  openSession(): Promise<StorageSession>;
  close(): Promise<void>;
}
