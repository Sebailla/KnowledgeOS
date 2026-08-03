import assert from "node:assert/strict";
import test from "node:test";
import type {
  Command,
  CommandReceipt,
  Query,
} from "@knowledgeos/contracts";
import type {
  CorrelationId,
  OperationId,
} from "@knowledgeos/domain-types";
import {
  CancellationSource,
  FixedClock,
  InMemoryCommandBus,
  InMemoryEventBus,
  InMemoryIdempotencyStore,
  InMemoryQueryBus,
  type ExecutionContext,
} from "../src/index.js";

const context: ExecutionContext = {
  operationId: "operation:test" as OperationId,
  correlationId: "correlation:test" as CorrelationId,
  privacyClass: "personal",
  clock: new FixedClock(new Date("2026-08-01T00:00:00.000Z")),
  cancellation: CancellationSource.none(),
  metadata: {},
};

test("command bus dispatches registered handlers", async () => {
  const bus = new InMemoryCommandBus();
  bus.register("test.command", {
    async handle(): Promise<CommandReceipt> {
      return {
        commandId: context.operationId,
        accepted: true,
      };
    },
  });

  const receipt = await bus.execute(
    {
      type: "test.command",
      commandId: context.operationId,
    } as Command,
    context,
  );

  assert.equal(receipt.accepted, true);
});

test("query bus returns typed results", async () => {
  const bus = new InMemoryQueryBus();
  bus.register("test.query", {
    async handle(): Promise<number> {
      return 42;
    },
  });

  const value = await bus.execute<number>(
    { type: "test.query" } as Query,
    context,
  );

  assert.equal(value, 42);
});

test("event bus publishes to subscribers", async () => {
  const bus = new InMemoryEventBus();
  let count = 0;
  bus.subscribe("test.event", {
    async handle(): Promise<void> {
      count += 1;
    },
  });

  await bus.publish(
    { type: "test.event" } as never,
    context,
  );

  assert.equal(count, 1);
});

test("idempotency store rejects duplicate begin", async () => {
  const store = new InMemoryIdempotencyStore();
  assert.equal(
    await store.begin(context.operationId, "same-key"),
    true,
  );
  assert.equal(
    await store.begin(context.operationId, "same-key"),
    false,
  );
});
