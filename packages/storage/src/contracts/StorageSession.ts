import type { StorageRecord } from "./StorageRecord.js";
import type { StorageTransaction } from "./StorageTransaction.js";

export interface PutOptions {
  readonly expectedVersion?: number;
}

export interface StorageSession {
  get<TValue>(key: string): Promise<StorageRecord<TValue> | undefined>;
  put<TValue>(
    key: string,
    value: TValue,
    options?: PutOptions,
  ): Promise<StorageRecord<TValue>>;
  delete(
    key: string,
    options?: PutOptions,
  ): Promise<boolean>;
  list<TValue>(
    prefix?: string,
  ): Promise<readonly StorageRecord<TValue>[]>;
  beginTransaction(): Promise<StorageTransaction>;
  close(): Promise<void>;
}
