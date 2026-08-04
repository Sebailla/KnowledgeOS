export interface StorageCapabilities {
  readonly transactions: boolean;
  readonly migrations: boolean;
  readonly optimisticConcurrency: boolean;
  readonly snapshots: boolean;
  readonly streaming: boolean;
}
