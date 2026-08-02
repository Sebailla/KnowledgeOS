import assert from "node:assert/strict";
import {
  PostgresHealthCheck,
  PostgresMigrationRunner,
  TransactionContextDatabase,
} from "../dist/index.js";

class FakeTransaction {
  constructor(database) {
    this.database = database;
    this.committed = false;
    this.rolledBack = false;
  }

  query(sql, parameters = []) {
    return this.database.query(sql, parameters);
  }

  async commit() {
    this.committed = true;
    this.database.commits += 1;
  }

  async rollback() {
    this.rolledBack = true;
    this.database.rollbacks += 1;
  }
}

class FakeDatabase {
  constructor() {
    this.queries = [];
    this.migrations = new Map();
    this.commits = 0;
    this.rollbacks = 0;
  }

  async query(sql, parameters = []) {
    this.queries.push({ sql, parameters });

    if (sql.includes("select now()")) {
      return {
        rows: [{ server_time: "2026-08-01 00:00:00+00" }],
        rowCount: 1,
      };
    }

    if (sql.includes("from knowledgeos_schema_migrations")) {
      const id = parameters[0];
      const checksum = this.migrations.get(id);
      return checksum
        ? {
            rows: [{ migration_id: id, checksum }],
            rowCount: 1,
          }
        : { rows: [], rowCount: 0 };
    }

    if (sql.includes("insert into knowledgeos_schema_migrations")) {
      this.migrations.set(parameters[0], parameters[1]);
    }

    return { rows: [], rowCount: 0 };
  }

  async begin() {
    return new FakeTransaction(this);
  }
}

const database = new FakeDatabase();

const runner = new PostgresMigrationRunner(database);
const first = await runner.migrate([
  {
    id: "0001",
    checksum: "sha256:test",
    sql: "create table example(id text primary key)",
  },
]);
assert.deepEqual(first.applied, ["0001"]);

const second = await runner.migrate([
  {
    id: "0001",
    checksum: "sha256:test",
    sql: "create table example(id text primary key)",
  },
]);
assert.deepEqual(second.skipped, ["0001"]);
assert.equal(database.commits, 1);

const contextual = new TransactionContextDatabase(database);
await contextual.run(async () => {
  await contextual.query("insert into example values ($1)", ["a"]);
});
assert.equal(database.commits, 2);

await assert.rejects(
  () =>
    contextual.run(async () => {
      throw new Error("rollback");
    }),
);
assert.equal(database.rollbacks, 1);

let tick = 100;
const health = new PostgresHealthCheck(database, () => tick++);
const healthResult = await health.execute();
assert.equal(healthResult.state, "healthy");

console.log(JSON.stringify({
  flow: "postgres-driver-migrations-transactions-health",
  status: "passed",
  commits: database.commits,
  rollbacks: database.rollbacks,
}));
