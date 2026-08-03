import type { OperationId } from "@knowledgeos/domain-types";

export interface IdempotencyRecord<T> {
  readonly operationId: OperationId;
  readonly key: string;
  readonly status: "running" | "completed" | "failed";
  readonly result?: T;
  readonly failureCode?: string;
}

export interface IdempotencyStore {
  get<T>(key: string): Promise<IdempotencyRecord<T> | undefined>;
  begin(operationId: OperationId, key: string): Promise<boolean>;
  complete<T>(key: string, result: T): Promise<void>;
  fail(key: string, failureCode: string): Promise<void>;
}

export class InMemoryIdempotencyStore
implements IdempotencyStore {
  private readonly records =
    new Map<string, IdempotencyRecord<unknown>>();

  async get<T>(
    key: string,
  ): Promise<IdempotencyRecord<T> | undefined> {
    return this.records.get(key) as
      | IdempotencyRecord<T>
      | undefined;
  }

  async begin(
    operationId: OperationId,
    key: string,
  ): Promise<boolean> {
    if (this.records.has(key)) return false;
    this.records.set(key, {
      operationId,
      key,
      status: "running",
    });
    return true;
  }

  async complete<T>(
    key: string,
    result: T,
  ): Promise<void> {
    const current = this.records.get(key);
    if (!current) {
      throw new Error(`Unknown idempotency key: ${key}`);
    }
    this.records.set(key, {
      ...current,
      status: "completed",
      result,
    });
  }

  async fail(
    key: string,
    failureCode: string,
  ): Promise<void> {
    const current = this.records.get(key);
    if (!current) {
      throw new Error(`Unknown idempotency key: ${key}`);
    }
    this.records.set(key, {
      ...current,
      status: "failed",
      failureCode,
    });
  }
}
