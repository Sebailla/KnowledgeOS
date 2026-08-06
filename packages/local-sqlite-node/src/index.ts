import { DatabaseSync } from "node:sqlite";
export interface NodeSqliteDatabaseOptions { readonly path: string; }
export interface Migration { readonly version: number; readonly sql: string; }
export class NodeSqliteDatabase {
  readonly connection: DatabaseSync;
  constructor(options: NodeSqliteDatabaseOptions) { this.connection = new DatabaseSync(options.path); this.connection.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;"); }
  migrate(migrations: readonly Migration[]): void { this.connection.exec("CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY)"); for (const m of migrations) { const found=this.connection.prepare("SELECT version FROM schema_migrations WHERE version=?").get(m.version); if(!found){ this.connection.exec("BEGIN"); try { this.connection.exec(m.sql); this.connection.prepare("INSERT INTO schema_migrations(version) VALUES (?)").run(m.version); this.connection.exec("COMMIT"); } catch(e){ this.connection.exec("ROLLBACK"); throw e; } } } }
  checkpoint(): void { this.connection.exec("PRAGMA wal_checkpoint(TRUNCATE)"); }
  close(): void { this.connection.close(); }
}
