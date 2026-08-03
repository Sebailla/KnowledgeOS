import type {
  PutOptions,
  StorageSession,
} from "../contracts/StorageSession.js";
import type { StorageRecord } from "../contracts/StorageRecord.js";
import type { StorageTransaction } from "../contracts/StorageTransaction.js";
import { InvalidStorageStateError } from "../errors/InvalidStorageStateError.js";
import { StorageConflictError } from "../errors/StorageConflictError.js";
import { InMemoryStorageTransaction } from "./InMemoryStorageTransaction.js";

export class InMemoryStorageSession
implements StorageSession {
  private readonly pending =
    new Map<string, StorageRecord<unknown> | undefined>();

  private activeTransaction:
    InMemoryStorageTransaction | undefined;

  private closed = false;
  private transactionSequence = 0;

  public constructor(
    private readonly records:
      Map<string, StorageRecord<unknown>>,
    private readonly now: () => string =
      () => new Date().toISOString(),
  ) {}

  public async get<TValue>(
    key: string,
  ): Promise<StorageRecord<TValue> | undefined> {
    this.assertOpen();

    if (this.pending.has(key)) {
      return this.pending.get(key) as
        StorageRecord<TValue> | undefined;
    }

    return this.records.get(key) as
      StorageRecord<TValue> | undefined;
  }

  public async put<TValue>(
    key: string,
    value: TValue,
    options: PutOptions = {},
  ): Promise<StorageRecord<TValue>> {
    this.assertOpen();

    const existing = await this.get<TValue>(key);

    if (
      options.expectedVersion !== undefined &&
      existing?.version !== options.expectedVersion
    ) {
      throw new StorageConflictError(
        `Expected version ${options.expectedVersion} for '${key}', ` +
        `but found ${existing?.version ?? "none"}.`,
      );
    }

    const timestamp = this.now();

    const record: StorageRecord<TValue> = {
      key,
      value,
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    this.write(key, record);

    return record;
  }

  public async delete(
    key: string,
    options: PutOptions = {},
  ): Promise<boolean> {
    this.assertOpen();

    const existing = await this.get(key);

    if (!existing) {
      return false;
    }

    if (
      options.expectedVersion !== undefined &&
      existing.version !== options.expectedVersion
    ) {
      throw new StorageConflictError(
        `Expected version ${options.expectedVersion} for '${key}', ` +
        `but found ${existing.version}.`,
      );
    }

    this.write(key, undefined);
    return true;
  }

  public async list<TValue>(
    prefix = "",
  ): Promise<readonly StorageRecord<TValue>[]> {
    this.assertOpen();

    const merged =
      new Map<string, StorageRecord<unknown>>(this.records);

    for (const [key, value] of this.pending) {
      if (value === undefined) {
        merged.delete(key);
      } else {
        merged.set(key, value);
      }
    }

    return [...merged.values()]
      .filter((record) => record.key.startsWith(prefix))
      .sort((left, right) =>
        left.key.localeCompare(right.key),
      ) as readonly StorageRecord<TValue>[];
  }

  public async beginTransaction():
  Promise<StorageTransaction> {
    this.assertOpen();

    if (this.activeTransaction) {
      throw new InvalidStorageStateError(
        "A transaction is already active for this session.",
      );
    }

    this.transactionSequence += 1;

    this.activeTransaction =
      new InMemoryStorageTransaction(
        `transaction:${this.transactionSequence}`,
        async () => {
          for (const [key, value] of this.pending) {
            if (value === undefined) {
              this.records.delete(key);
            } else {
              this.records.set(key, value);
            }
          }

          this.pending.clear();
          this.activeTransaction = undefined;
        },
        async () => {
          this.pending.clear();
          this.activeTransaction = undefined;
        },
      );

    return this.activeTransaction;
  }

  public async close(): Promise<void> {
    if (this.activeTransaction) {
      await this.activeTransaction.rollback(
        new Error("Session closed"),
      );
    }

    this.closed = true;
  }

  private write(
    key: string,
    value: StorageRecord<unknown> | undefined,
  ): void {
    if (this.activeTransaction) {
      this.pending.set(key, value);
      return;
    }

    if (value === undefined) {
      this.records.delete(key);
    } else {
      this.records.set(key, value);
    }
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new InvalidStorageStateError(
        "Storage session is closed.",
      );
    }
  }
}
