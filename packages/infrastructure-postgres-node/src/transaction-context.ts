import { AsyncLocalStorage } from "node:async_hooks";
import type {
  SqlDatabase,
  SqlParameters,
  SqlResult,
  SqlRow,
  SqlTransaction,
} from "@knowledgeos/infrastructure-postgres";
import type {
  Transaction,
  UnitOfWork,
} from "@knowledgeos/kernel";

class ContextTransaction implements Transaction {
  public constructor(
    private readonly transaction: SqlTransaction,
  ) {}

  commit(): Promise<void> {
    return this.transaction.commit();
  }

  rollback(): Promise<void> {
    return this.transaction.rollback();
  }
}

export class TransactionContextDatabase
implements SqlDatabase, UnitOfWork {
  private readonly context =
    new AsyncLocalStorage<SqlTransaction>();

  public constructor(
    private readonly database: SqlDatabase,
  ) {}

  async query<Row extends SqlRow = SqlRow>(
    sql: string,
    parameters: SqlParameters = [],
  ): Promise<SqlResult<Row>> {
    const transaction = this.context.getStore();
    return (transaction ?? this.database).query<Row>(
      sql,
      parameters,
    );
  }

  begin(): Promise<SqlTransaction> {
    return this.database.begin();
  }

  async run<T>(work: () => Promise<T>): Promise<T> {
    const existing = this.context.getStore();
    if (existing) {
      return work();
    }

    const transaction = await this.database.begin();

    return this.context.run(transaction, async () => {
      try {
        const result = await work();
        await transaction.commit();
        return result;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  }

  async beginUnit(): Promise<Transaction> {
    return new ContextTransaction(
      await this.database.begin(),
    );
  }
}
