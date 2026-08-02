import assert from "node:assert/strict";
import test from "node:test";
import type { SqlDatabase, SqlResult, SqlTransaction } from "../src/index.js";
import { PostgresUnitOfWork } from "../src/index.js";

class FakeTransaction implements SqlTransaction {
  committed = false;
  rolledBack = false;

  async query(): Promise<SqlResult> {
    return { rows: [], rowCount: 0 };
  }

  async commit(): Promise<void> {
    this.committed = true;
  }

  async rollback(): Promise<void> {
    this.rolledBack = true;
  }
}

class FakeDatabase implements SqlDatabase {
  readonly transaction = new FakeTransaction();

  async query(): Promise<SqlResult> {
    return { rows: [], rowCount: 0 };
  }

  async begin(): Promise<SqlTransaction> {
    return this.transaction;
  }
}

test("unit of work commits successful work", async () => {
  const database = new FakeDatabase();
  const unit = new PostgresUnitOfWork(database);

  const result = await unit.run(async () => 42);

  assert.equal(result, 42);
  assert.equal(database.transaction.committed, true);
  assert.equal(database.transaction.rolledBack, false);
});

test("unit of work rolls back failed work", async () => {
  const database = new FakeDatabase();
  const unit = new PostgresUnitOfWork(database);

  await assert.rejects(
    () => unit.run(async () => {
      throw new Error("failure");
    }),
  );

  assert.equal(database.transaction.committed, false);
  assert.equal(database.transaction.rolledBack, true);
});
