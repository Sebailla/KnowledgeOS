declare module "node:async_hooks" {
  export class AsyncLocalStorage<T> {
    run<R>(store: T, callback: () => R): R;
    getStore(): T | undefined;
  }
}

declare module "pg" {
  export interface QueryResult<Row = Record<string, unknown>> {
    readonly rows: readonly Row[];
    readonly rowCount: number | null;
  }

  export interface PoolClient {
    query<Row = Record<string, unknown>>(
      text: string,
      values?: readonly unknown[],
    ): Promise<QueryResult<Row>>;
    release(error?: Error): void;
  }

  export interface PoolConfig {
    readonly connectionString?: string;
    readonly max?: number;
    readonly idleTimeoutMillis?: number;
    readonly connectionTimeoutMillis?: number;
    readonly application_name?: string;
  }

  export class Pool {
    constructor(configuration?: PoolConfig);
    query<Row = Record<string, unknown>>(
      text: string,
      values?: readonly unknown[],
    ): Promise<QueryResult<Row>>;
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
  }
}
