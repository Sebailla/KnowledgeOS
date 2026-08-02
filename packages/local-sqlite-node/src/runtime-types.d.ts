declare module "node:sqlite" {
  export interface StatementSync {
    all(...parameters: readonly unknown[]): readonly Record<string, unknown>[];
    run(...parameters: readonly unknown[]): {
      readonly changes: number | bigint;
      readonly lastInsertRowid: number | bigint;
    };
  }

  export interface DatabaseSyncOptions {
    readonly open?: boolean;
    readonly readOnly?: boolean;
    readonly enableForeignKeyConstraints?: boolean;
    readonly timeout?: number;
  }

  export class DatabaseSync {
    constructor(path: string, options?: DatabaseSyncOptions);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
