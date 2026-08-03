import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryStorageProvider,
  MigrationRunner,
  StorageConflictError,
  StorageEngine,
  StorageUnitOfWork,
} from "../src/index.js";
import {
  CancellationNone,
  withinUnitOfWork,
} from "@knowledgeos/kernel";

test("storage session writes and reads records", async () => {
  const provider = new InMemoryStorageProvider();
  const session = await provider.openSession();

  const record = await session.put(
    "object:1",
    { title: "KnowledgeOS" },
  );

  assert.equal(record.version, 1);
  assert.deepEqual(
    (await session.get<{ title: string }>("object:1"))?.value,
    { title: "KnowledgeOS" },
  );
});

test("optimistic concurrency rejects stale writes", async () => {
  const provider = new InMemoryStorageProvider();
  const session = await provider.openSession();

  await session.put("object:1", { value: 1 });

  await assert.rejects(
    () =>
      session.put(
        "object:1",
        { value: 2 },
        { expectedVersion: 0 },
      ),
    StorageConflictError,
  );
});

test("transaction commit persists changes", async () => {
  const provider = new InMemoryStorageProvider();
  const session = await provider.openSession();

  const transaction =
    await session.beginTransaction();

  await session.put("object:1", { value: 1 });

  assert.equal(
    (await session.get("object:1"))?.version,
    1,
  );

  await transaction.commit();

  const another =
    await provider.openSession();

  assert.equal(
    (await another.get("object:1"))?.version,
    1,
  );
});

test("transaction rollback discards changes", async () => {
  const provider = new InMemoryStorageProvider();
  const session = await provider.openSession();

  const transaction =
    await session.beginTransaction();

  await session.put("object:1", { value: 1 });

  await transaction.rollback();

  assert.equal(
    await session.get("object:1"),
    undefined,
  );
});

test("storage unit of work integrates with kernel helper", async () => {
  const provider = new InMemoryStorageProvider();
  const session = await provider.openSession();
  const unitOfWork = new StorageUnitOfWork(session);

  await withinUnitOfWork(
    unitOfWork,
    async () => {
      await session.put("object:1", { value: 1 });
    },
  );

  assert.equal(
    (await session.get("object:1"))?.version,
    1,
  );
});

test("migration runner executes unapplied migrations once", async () => {
  const provider = new InMemoryStorageProvider();
  const session = await provider.openSession();

  const applied = new Set<string>();
  const runner = new MigrationRunner({
    async getAppliedMigrationIds() {
      return [...applied];
    },
    async markApplied(id) {
      applied.add(id);
    },
  });

  const migrations = [
    {
      id: "001",
      description: "create seed record",
      async up(targetSession: typeof session) {
        await targetSession.put(
          "migration:seed",
          { applied: true },
        );
      },
    },
  ];

  assert.deepEqual(
    await runner.run(migrations, session),
    ["001"],
  );

  assert.deepEqual(
    await runner.run(migrations, session),
    [],
  );
});

test("storage engine follows kernel lifecycle", async () => {
  const engine =
    new StorageEngine(
      new InMemoryStorageProvider(),
    );

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  assert.equal(engine.isRunning, true);

  await engine.stop(context);
  await engine.dispose(context);

  assert.equal(engine.isRunning, false);
});
