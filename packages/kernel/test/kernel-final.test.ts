import assert from "node:assert/strict";
import test from "node:test";

import {
  CapabilityAlreadyRegisteredError,
  CapabilityRegistry,
  EngineDependencyError,
  EngineRegistry,
  EventBus,
  IdempotencyCoordinator,
  InMemoryIdempotencyStore,
  createExecutionContext,
  type DomainEvent,
  type Engine,
  type EngineContext,
} from "../src/index.js";

class StubEngine implements Engine {
  public readonly name: string;
  public readonly version = "1.0.0";

  public constructor(
    public readonly id: string,
    public readonly dependencies: readonly string[] = [],
  ) {
    this.name = id;
  }

  public async initialize(_context: EngineContext): Promise<void> {}
  public async start(_context: EngineContext): Promise<void> {}
  public async stop(_context: EngineContext): Promise<void> {}
  public async dispose(_context: EngineContext): Promise<void> {}
}

test("engine registry detects circular dependencies", () => {
  const registry = new EngineRegistry();

  registry.register(new StubEngine("a", ["b"]));
  registry.register(new StubEngine("b", ["a"]));

  assert.throws(
    () => registry.getOrdered(),
    EngineDependencyError,
  );
});

test("capability registry indexes by provider", () => {
  const registry = new CapabilityRegistry();

  registry.register({
    id: "read-document",
    version: "1.0.0",
    providerEngineId: "reader",
  });

  registry.register({
    id: "annotate-document",
    version: "1.0.0",
    providerEngineId: "reader",
  });

  assert.equal(
    registry.getByProvider("reader").length,
    2,
  );
});

test("duplicate capabilities are rejected", () => {
  const registry = new CapabilityRegistry();
  const capability = {
    id: "search",
    version: "1.0.0",
    providerEngineId: "search-engine",
  };

  registry.register(capability);

  assert.throws(
    () => registry.register(capability),
    CapabilityAlreadyRegisteredError,
  );
});

test("concurrent idempotent executions share one operation", async () => {
  const coordinator = new IdempotencyCoordinator();
  const store = new InMemoryIdempotencyStore();

  let executions = 0;

  const operation = async () => {
    executions += 1;
    await Promise.resolve();
    return 42;
  };

  const results = await Promise.all([
    coordinator.execute("same", store, operation),
    coordinator.execute("same", store, operation),
    coordinator.execute("same", store, operation),
  ]);

  assert.deepEqual(results, [42, 42, 42]);
  assert.equal(executions, 1);
});

test("event bus fail-fast propagates handler failure", async () => {
  interface TestEvent extends DomainEvent {
    readonly type: "test";
  }

  const bus = new EventBus();

  bus.subscribe<TestEvent>("test", {
    async handle() {
      throw new Error("failed");
    },
  });

  await assert.rejects(
    () =>
      bus.publish(
        {
          type: "test",
          occurredAt: "2026-08-03T00:00:00.000Z",
        },
        createExecutionContext({
          correlationId: "correlation:final",
        }),
        { failFast: true },
      ),
  );
});
