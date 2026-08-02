import type { SqlExecutor, SqlRow } from "../sql.js";

export abstract class BaseJsonRepository<Id, Aggregate> {
  protected constructor(
    private readonly table: string,
    protected readonly sql: SqlExecutor,
  ) {}

  protected abstract toRow(
    value: Aggregate,
  ): { readonly id: Id; readonly state: string };

  protected abstract fromRow(row: SqlRow): Aggregate;

  async get(id: Id): Promise<Aggregate | undefined> {
    const result = await this.sql.query(
      `select id, state from ${this.table} where id = $1`,
      [String(id)],
    );
    const row = result.rows[0];
    return row ? this.fromRow(row) : undefined;
  }

  async save(value: Aggregate): Promise<void> {
    const row = this.toRow(value);
    await this.sql.query(
      `
        insert into ${this.table} (id, state)
        values ($1, $2::jsonb)
        on conflict (id)
        do update set state = excluded.state,
                      updated_at = now()
      `,
      [String(row.id), row.state],
    );
  }
}
