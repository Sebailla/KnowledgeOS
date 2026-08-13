import { Pool, type PoolConfig, type QueryResultRow } from "pg";

export interface SqlResult<Row extends object> { readonly rows: readonly Row[]; }
export interface SqlClient { query<Row extends object = Record<string, unknown>>(text: string, values?: readonly unknown[]): Promise<SqlResult<Row>>; }

export class PgSqlClient implements SqlClient {
  private readonly pool: Pool;
  public constructor(configuration: PoolConfig) { this.pool = new Pool(configuration); }
  public async query<Row extends QueryResultRow = QueryResultRow>(text: string, values: readonly unknown[] = []): Promise<SqlResult<Row>> {
    const result = await this.pool.query<Row>(text, [...values]);
    return { rows: result.rows };
  }
  public async close(): Promise<void> { await this.pool.end(); }
}
