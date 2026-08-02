export interface SqliteRow {
  readonly [key: string]: unknown;
}

export interface SqliteResult<Row extends SqliteRow = SqliteRow> {
  readonly rows: readonly Row[];
  readonly changes: number;
}

export interface SqliteExecutor {
  execute<Row extends SqliteRow = SqliteRow>(
    sql: string,
    parameters?: readonly unknown[],
  ): Promise<SqliteResult<Row>>;
}

export interface SqliteTransactionManager {
  run<T>(
    work: (
      executor: SqliteExecutor,
    ) => Promise<T>,
  ): Promise<T>;
}
