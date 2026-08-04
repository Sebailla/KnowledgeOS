import assert from "node:assert/strict";
import test from "node:test";

import {
  CancellationSource,
  CommandBus,
  EventBus,
  InMemoryIdempotencyStore,
  MonotonicIdGenerator,
  QueryBus,
  childExecutionContext,
  composeMiddleware,
  createExecutionContext,
  executeIdempotently,
  retry,
  withinUnitOfWork,
  type Command,
  type DomainEvent,
  type Middleware,
  type Query,
  type UnitOfWork,
} from "../src/index.js";

const context = createExecutionContext({
  correlationId: "correlation:1",
});

test("command bus executes registered handler", async () => {
  interface AddCommand extends Command<number> {
    readonly type: "add";
    readonly left: number;
    readonly right: number;
  }

  const bus = new CommandBus();

  bus.register<AddCommand, number>("add", {
    async execute(command) {
      return command.left + command.right;
    },
  });

  assert.equal(
    await bus.execute<AddCommand, number>(
      {
        type: "add",
        left: 2,
        right: 3,
      },
      context,
    ),
    5,
  );
});

test("query bus executes middleware in deterministic order", async () => {
  interface ValueQuery extends Query<number> {
    readonly type: "value";
  }

  const calls: string[] = [];
  const bus = new QueryBus();

  const middleware: Middleware<Query<unknown>, unknown> = {
    async invoke(_query, _context, next) {
      calls.push("before");
      const result = await next();
      calls.push("after");
      return result;
    },
  };

  bus.use(middleware);
  bus.register<ValueQuery, number>("value", {
    async execute() {
      calls.push("handler");
      return 7;
    },
  });

  assert.equal(
    await bus.execute<ValueQuery, number>(
      { type: "value" },
      context,
    ),
    7,
  );

  assert.deepEqual(
    calls,
    ["before", "handler", "after"],
  );
});

test("event bus isolates handler failures", async () => {
  interface CreatedEvent extends DomainEvent {
    readonly type: "created";
  }

  const calls: string[] = [];
  const bus = new EventBus();

  bus.subscribe<CreatedEvent>("created", {
    async handle() {
      calls.push("first");
    },
  });

  bus.subscribe<CreatedEvent>("created", {
    async handle() {
      throw new Error("failure");
    },
  });

  const result = await bus.publish<CreatedEvent>(
    {
      type: "created",
      occurredAt: "2026-08-03T00:00:00.000Z",
    },
    context,
  );

  assert.deepEqual(calls, ["first"]);
  assert.equal(result.handledBy, 2);
  assert.equal(result.errors.length, 1);
});

test("cancellation notifies listeners once", () => {
  const source = new CancellationSource();
  const reasons: unknown[] = [];

  source.token.onCancellationRequested((reason) => {
    reasons.push(reason);
  });

  source.cancel("first");
  source.cancel("second");

  assert.deepEqual(reasons, ["first"]);
  assert.equal(source.token.isCancellationRequested, true);
});

test("retry succeeds after transient failures", async () => {
  const source = new CancellationSource();
  let attempts = 0;

  const result = await retry(
    async () => {
      attempts += 1;
      if (attempts < 3) {
        throw new Error("transient");
      }
      return "ok";
    },
    {
      maxAttempts: 3,
      delayMilliseconds: () => 0,
    },
    source.token,
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 3);
});

test("idempotency returns cached result", async () => {
  const store = new InMemoryIdempotencyStore();
  let executions = 0;

  const operation = async () => {
    executions += 1;
    return executions;
  };

  assert.equal(
    await executeIdempotently("key", store, operation),
    1,
  );
  assert.equal(
    await executeIdempotently("key", store, operation),
    1,
  );
  assert.equal(executions, 1);
});

test("unit of work rolls back failed operation", async () => {
  const calls: string[] = [];

  const unitOfWork: UnitOfWork = {
    async begin() {
      calls.push("begin");
    },
    async commit() {
      calls.push("commit");
    },
    async rollback() {
      calls.push("rollback");
    },
  };

  await assert.rejects(
    () =>
      withinUnitOfWork(unitOfWork, async () => {
        throw new Error("failed");
      }),
  );

  assert.deepEqual(
    calls,
    ["begin", "rollback"],
  );
});

test("child execution context preserves correlation", () => {
  const child = childExecutionContext(context, {
    metadata: { source: "test" },
  });

  assert.equal(
    child.correlationId,
    context.correlationId,
  );
  assert.deepEqual(
    child.metadata,
    { source: "test" },
  );
});

test("monotonic id generator produces unique ordered values", () => {
  const generator =
    new MonotonicIdGenerator(
      "object",
      () => 100,
    );

  const first = generator.next();
  const second = generator.next();

  assert.notEqual(first, second);
  assert.equal(first < second, true);
});

test("compose middleware rejects multiple next calls", async () => {
  const middleware: Middleware<string, string> = {
    async invoke(_input, _context, next) {
      await next();
      return next();
    },
  };

  await assert.rejects(
    () =>
      composeMiddleware(
        [middleware],
        "input",
        context,
        async () => "result",
      ),
  );
});
