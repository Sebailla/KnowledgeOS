import type { UnitOfWork } from "@knowledgeos/kernel";

import type { StorageSession } from "./contracts/StorageSession.js";
import type { StorageTransaction } from "./contracts/StorageTransaction.js";

export class StorageUnitOfWork
implements UnitOfWork {
  private transaction:
    StorageTransaction | undefined;

  public constructor(
    private readonly session: StorageSession,
  ) {}

  public async begin(): Promise<void> {
    this.transaction =
      await this.session.beginTransaction();
  }

  public async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error(
        "Storage Unit of Work has not begun.",
      );
    }

    await this.transaction.commit();
    this.transaction = undefined;
  }

  public async rollback(
    cause?: unknown,
  ): Promise<void> {
    if (!this.transaction) {
      return;
    }

    await this.transaction.rollback(cause);
    this.transaction = undefined;
  }
}
