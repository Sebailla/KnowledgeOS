export type StorageTransactionState =
  | "active"
  | "committed"
  | "rolled-back";

export interface StorageTransaction {
  readonly id: string;
  readonly state: StorageTransactionState;

  commit(): Promise<void>;
  rollback(cause?: unknown): Promise<void>;
}
