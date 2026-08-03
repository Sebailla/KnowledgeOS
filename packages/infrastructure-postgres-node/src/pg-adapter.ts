import type {
  Pool,
  PoolClient,
  QueryResult,
} from "pg";
import type {
  SqlDatabase,
  SqlParameters,
  SqlResult,
  SqlRow,
  SqlTransaction,
} from "@knowledgeos/infrastructure-postgres";

function mapResult<Row extends SqlRow>(
  result: QueryResult<Row>,
): SqlResult<Row> {
  return {
    rows: result.rows,
    rowCount: result.rowCount ?? result.rows.length,
  };
}

class PgTransaction implements SqlTransaction {
  private completed = false;

  public constructor(
    private readonly client: PoolClient,
  ) {}

  async query<Row extends SqlRow = SqlRow>(
    sql: string,
    parameters: SqlParameters = [],
  ): Promise<SqlResult<Row>> {
    return mapResult(
      await this.client.query<Row>(sql, parameters),
    );
  }

  async commit(): Promise<void> {
    if (this.completed) return;
    await this.client.query("commit");
    this.completed = true;
    this.client.release();
  }

  async rollback(): Promise<void> {
    if (this.completed) return;
    try {
      await this.client.query("rollback");
    } finally {
      this.completed = true;
      this.client.release();
    }
  }
}

export class PgDatabaseAdapter implements SqlDatabase {
  public constructor(
    public readonly pool: Pool,
  ) {}

  async query<Row extends SqlRow = SqlRow>(
    sql: string,
    parameters: SqlParameters = [],
  ): Promise<SqlResult<Row>> {
    return mapResult(
      await this.pool.query<Row>(sql, parameters),
    );
  }

  async begin(): Promise<SqlTransaction> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      return new PgTransaction(client);
    } catch (error) {
      client.release(
        error instanceof Error ? error : undefined,
      );
      throw error;
    }
  }

  close(): Promise<void> {
    return this.pool.end();
  }
}
