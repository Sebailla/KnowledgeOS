import { DatabaseSync } from "node:sqlite";
import type {
  SqliteExecutor,
  SqliteResult,
  SqliteRow,
  SqliteTransactionManager,
} from "@knowledgeos/local-library-sqlite";

export interface NodeSqliteConfiguration {
  readonly path: string;
  readonly busyTimeoutMilliseconds?: number;
  readonly journalMode?: "WAL" | "DELETE";
  readonly synchronous?: "NORMAL" | "FULL";
}

export class NodeSqliteDatabase
implements SqliteExecutor, SqliteTransactionManager {
  private readonly database: DatabaseSync;
  private transactionDepth = 0;

  public constructor(
    configuration: NodeSqliteConfiguration,
  ) {
    this.database = new DatabaseSync(
      configuration.path,
      {
        open: true,
        enableForeignKeyConstraints: true,
        timeout:
          configuration.busyTimeoutMilliseconds ??
          5_000,
      },
    );

    this.database.exec(
      `pragma journal_mode = ${
        configuration.journalMode ?? "WAL"
      };`,
    );
    this.database.exec(
      `pragma synchronous = ${
        configuration.synchronous ?? "NORMAL"
      };`,
    );
    this.database.exec("pragma foreign_keys = on;");
    this.database.exec(
      `pragma busy_timeout = ${
        configuration.busyTimeoutMilliseconds ??
        5_000
      };`,
    );
  }

  async execute<
    Row extends SqliteRow = SqliteRow,
  >(
    sql: string,
    parameters: readonly unknown[] = [],
  ): Promise<SqliteResult<Row>> {
    const statement =
      this.database.prepare(sql);

    if (this.isQuery(sql)) {
      return {
        rows:
          statement.all(
            ...parameters,
          ) as readonly Row[],
        changes: 0,
      };
    }

    const result =
      statement.run(...parameters);

    return {
      rows: [],
      changes:
        typeof result.changes === "bigint"
          ? Number(result.changes)
          : result.changes,
    };
  }

  async run<T>(
    work: (
      executor: SqliteExecutor,
    ) => Promise<T>,
  ): Promise<T> {
    const nested =
      this.transactionDepth > 0;
    const savepoint =
      `knowledgeos_sp_${this.transactionDepth}`;

    if (nested) {
      this.database.exec(
        `savepoint ${savepoint};`,
      );
    } else {
      this.database.exec(
        "begin immediate;",
      );
    }

    this.transactionDepth += 1;

    try {
      const result =
        await work(this);

      this.transactionDepth -= 1;

      if (nested) {
        this.database.exec(
          `release savepoint ${savepoint};`,
        );
      } else {
        this.database.exec("commit;");
      }

      return result;
    } catch (error) {
      this.transactionDepth -= 1;

      if (nested) {
        this.database.exec(
          `rollback to savepoint ${savepoint};`,
        );
        this.database.exec(
          `release savepoint ${savepoint};`,
        );
      } else {
        this.database.exec("rollback;");
      }

      throw error;
    }
  }

  migrate(
    migrations: readonly {
      readonly id: string;
      readonly sql: string;
    }[],
  ): void {
    this.database.exec(`
      create table if not exists local_schema_migrations (
        migration_id text primary key,
        applied_at text not null
      );
    `);

    for (const migration of migrations) {
      const existing =
        this.database
          .prepare(
            `
              select migration_id
              from local_schema_migrations
              where migration_id = ?
            `,
          )
          .all(migration.id);

      if (existing.length > 0) {
        continue;
      }

      this.database.exec(
        "begin immediate;",
      );

      try {
        this.database.exec(
          migration.sql,
        );
        this.database
          .prepare(
            `
              insert into local_schema_migrations (
                migration_id,
                applied_at
              ) values (?, ?)
            `,
          )
          .run(
            migration.id,
            new Date().toISOString(),
          );
        this.database.exec("commit;");
      } catch (error) {
        this.database.exec("rollback;");
        throw error;
      }
    }
  }

  checkpoint(): void {
    this.database.exec(
      "pragma wal_checkpoint(truncate);",
    );
  }

  close(): void {
    this.database.close();
  }

  private isQuery(sql: string): boolean {
    const normalized =
      sql.trimStart().toLowerCase();

    return (
      normalized.startsWith("select") ||
      normalized.startsWith("pragma") ||
      normalized.startsWith("with")
    );
  }
}
