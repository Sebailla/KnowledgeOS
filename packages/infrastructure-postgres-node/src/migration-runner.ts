import type {
  SqlDatabase,
  SqlTransaction,
} from "@knowledgeos/infrastructure-postgres";

export interface Migration {
  readonly id: string;
  readonly checksum: string;
  readonly sql: string;
}

export interface MigrationResult {
  readonly applied: readonly string[];
  readonly skipped: readonly string[];
}

export class MigrationChecksumError extends Error {
  public constructor(id: string) {
    super(`Migration checksum mismatch: ${id}`);
    this.name = "MigrationChecksumError";
  }
}

export class PostgresMigrationRunner {
  public constructor(
    private readonly database: SqlDatabase,
  ) {}

  async migrate(
    migrations: readonly Migration[],
  ): Promise<MigrationResult> {
    await this.database.query(`
      create table if not exists knowledgeos_schema_migrations (
        migration_id text primary key,
        checksum text not null,
        applied_at timestamptz not null default now()
      )
    `);

    const applied: string[] = [];
    const skipped: string[] = [];

    for (const migration of migrations) {
      const existing = await this.database.query<{
        readonly migration_id: string;
        readonly checksum: string;
      }>(
        `
          select migration_id, checksum
          from knowledgeos_schema_migrations
          where migration_id = $1
        `,
        [migration.id],
      );

      const row = existing.rows[0];
      if (row) {
        if (row.checksum !== migration.checksum) {
          throw new MigrationChecksumError(migration.id);
        }
        skipped.push(migration.id);
        continue;
      }

      const transaction = await this.database.begin();
      await this.applyMigration(transaction, migration);
      applied.push(migration.id);
    }

    return { applied, skipped };
  }

  private async applyMigration(
    transaction: SqlTransaction,
    migration: Migration,
  ): Promise<void> {
    try {
      await transaction.query(migration.sql);
      await transaction.query(
        `
          insert into knowledgeos_schema_migrations (
            migration_id,
            checksum
          ) values ($1, $2)
        `,
        [migration.id, migration.checksum],
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
