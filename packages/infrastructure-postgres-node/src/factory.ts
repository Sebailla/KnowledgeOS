import type { PoolConfig } from "pg";
import { PgDatabaseAdapter } from "./pg-adapter.js";
import { TransactionContextDatabase } from "./transaction-context.js";

export interface PostgresRuntime {
  readonly adapter: PgDatabaseAdapter;
  readonly database: TransactionContextDatabase;
  close(): Promise<void>;
}

export async function createPostgresRuntime(
  configuration: PoolConfig,
): Promise<PostgresRuntime> {
  const module = await import("pg");
  const adapter = new PgDatabaseAdapter(
    new module.Pool(configuration),
  );
  const database = new TransactionContextDatabase(adapter);

  return {
    adapter,
    database,
    close: () => adapter.close(),
  };
}
