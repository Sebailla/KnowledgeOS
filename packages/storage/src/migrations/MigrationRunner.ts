import type { StorageSession } from "../contracts/StorageSession.js";
import type { Migration } from "./Migration.js";

export interface MigrationStateStore {
  getAppliedMigrationIds(): Promise<readonly string[]>;
  markApplied(migrationId: string): Promise<void>;
}

export class MigrationRunner {
  public constructor(
    private readonly stateStore: MigrationStateStore,
  ) {}

  public async run(
    migrations: readonly Migration[],
    session: StorageSession,
  ): Promise<readonly string[]> {
    const applied =
      new Set(await this.stateStore.getAppliedMigrationIds());

    const executed: string[] = [];

    for (const migration of migrations) {
      if (applied.has(migration.id)) {
        continue;
      }

      await migration.up(session);
      await this.stateStore.markApplied(migration.id);
      executed.push(migration.id);
    }

    return executed;
  }
}
