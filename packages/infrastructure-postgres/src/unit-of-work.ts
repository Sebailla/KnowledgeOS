import type { Transaction, UnitOfWork } from "@knowledgeos/kernel";
import type { SqlDatabase, SqlTransaction } from "./sql.js";

class PostgresTransaction implements Transaction {
  public constructor(
    public readonly sql: SqlTransaction,
  ) {}

  commit(): Promise<void> {
    return this.sql.commit();
  }

  rollback(): Promise<void> {
    return this.sql.rollback();
  }
}

export class PostgresUnitOfWork implements UnitOfWork {
  public constructor(private readonly database: SqlDatabase) {}

  async begin(): Promise<PostgresTransaction> {
    return new PostgresTransaction(await this.database.begin());
  }

  async run<T>(work: () => Promise<T>): Promise<T> {
    const transaction = await this.begin();
    try {
      const result = await work();
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
