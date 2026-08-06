declare module "node:sqlite" {
  export class StatementSync {
    run(...params: readonly unknown[]): unknown;
    get(...params: readonly unknown[]): unknown;
    all(...params: readonly unknown[]): readonly Record<string, unknown>[];
  }
  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
