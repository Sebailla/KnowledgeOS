export type SqlPrimitive =
  | string
  | number
  | boolean
  | null
  | Uint8Array;

export type SqlParameters = readonly SqlPrimitive[];

export interface SqlRow {
  readonly [column: string]: unknown;
}

export interface SqlResult<Row extends SqlRow = SqlRow> {
  readonly rows: readonly Row[];
  readonly rowCount: number;
}

export interface SqlExecutor {
  query<Row extends SqlRow = SqlRow>(
    sql: string,
    parameters?: SqlParameters,
  ): Promise<SqlResult<Row>>;
}

export interface SqlTransaction extends SqlExecutor {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface SqlDatabase extends SqlExecutor {
  begin(): Promise<SqlTransaction>;
}
