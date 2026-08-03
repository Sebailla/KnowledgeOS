import type {
  StorageTransaction,
  StorageTransactionState,
} from "../contracts/StorageTransaction.js";
import { InvalidStorageStateError } from "../errors/InvalidStorageStateError.js";

export class InMemoryStorageTransaction
implements StorageTransaction {
  private currentState: StorageTransactionState = "active";

  public constructor(
    public readonly id: string,
    private readonly onCommit: () => Promise<void>,
    private readonly onRollback: () => Promise<void>,
  ) {}

  public get state(): StorageTransactionState {
    return this.currentState;
  }

  public async commit(): Promise<void> {
    if (this.currentState !== "active") {
      throw new InvalidStorageStateError(
        `Cannot commit transaction in state '${this.currentState}'.`,
      );
    }

    await this.onCommit();
    this.currentState = "committed";
  }

  public async rollback(_cause?: unknown): Promise<void> {
    if (this.currentState !== "active") {
      throw new InvalidStorageStateError(
        `Cannot roll back transaction in state '${this.currentState}'.`,
      );
    }

    await this.onRollback();
    this.currentState = "rolled-back";
  }
}
