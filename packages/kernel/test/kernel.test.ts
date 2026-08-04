import assert from "node:assert/strict";
import test from "node:test";

import {
  EngineAlreadyRegisteredError,
  EngineDependencyError,
  InvalidKernelStateError,
  Kernel,
  KernelBuilder,
  KernelState,
  type Engine,
  type EngineContext,
} from "../src/index.js";

class TestEngine implements Engine {
  public readonly name: string;
  public readonly version = "1.0.0";
  public readonly calls: string[] = [];

  public constructor(
    public readonly id: string,
    public readonly dependencies: readonly string[] = [],
    private readonly failOn?: "initialize" | "start" | "stop" | "dispose",
  ) {
    this.name = id;
  }

  public async initialize(_context: EngineContext): Promise<void> {
    this.calls.push("initialize");
    if (this.failOn === "initialize") throw new Error("initialize failed");
  }

  public async start(_context: EngineContext): Promise<void> {
    this.calls.push("start");
    if (this.failOn === "start") throw new Error("start failed");
  }

  public async stop(_context: EngineContext): Promise<void> {
    this.calls.push("stop");
    if (this.failOn === "stop") throw new Error("stop failed");
  }

  public async dispose(_context: EngineContext): Promise<void> {
    this.calls.push("dispose");
    if (this.failOn === "dispose") throw new Error("dispose failed");
  }
}

test("kernel executes dependencies before dependents", async () => {
  const storage = new TestEngine("storage");
  const library = new TestEngine("library", ["storage"]);

  const kernel = new KernelBuilder()
    .addEngine(library)
    .addEngine(storage)
    .build();

  await kernel.initialize();
  await kernel.start();

  assert.equal(kernel.getState(), KernelState.Running);
  assert.deepEqual(storage.calls, ["initialize", "start"]);
  assert.deepEqual(library.calls, ["initialize", "start"]);
});

test("kernel stops and disposes in reverse dependency order", async () => {
  const calls: string[] = [];

  class OrderedEngine extends TestEngine {
    public override async stop(context: EngineContext): Promise<void> {
      calls.push(`stop:${this.id}`);
      await super.stop(context);
    }

    public override async dispose(context: EngineContext): Promise<void> {
      calls.push(`dispose:${this.id}`);
      await super.dispose(context);
    }
  }

  const storage = new OrderedEngine("storage");
  const library = new OrderedEngine("library", ["storage"]);

  const kernel = new KernelBuilder()
    .addEngine(library)
    .addEngine(storage)
    .build();

  await kernel.initialize();
  await kernel.start();
  await kernel.stop();
  await kernel.dispose();

  assert.deepEqual(calls, [
    "stop:library",
    "stop:storage",
    "dispose:library",
    "dispose:storage",
  ]);
  assert.equal(kernel.getState(), KernelState.Disposed);
});

test("duplicate engines are rejected", () => {
  const engine = new TestEngine("engine");
  const kernel = new Kernel();

  kernel.register(engine);

  assert.throws(
    () => kernel.register(engine),
    EngineAlreadyRegisteredError,
  );
});

test("missing dependencies are rejected before lifecycle execution", async () => {
  const kernel = new KernelBuilder()
    .addEngine(new TestEngine("library", ["storage"]))
    .build();

  await assert.rejects(
    () => kernel.initialize(),
    EngineDependencyError,
  );
});

test("invalid lifecycle transitions are rejected", async () => {
  const kernel = new Kernel();

  await assert.rejects(
    () => kernel.start(),
    InvalidKernelStateError,
  );
});

test("startup failure stops engines that already started", async () => {
  const first = new TestEngine("first");
  const second = new TestEngine("second", ["first"], "start");

  const kernel = new KernelBuilder()
    .addEngine(first)
    .addEngine(second)
    .build();

  await kernel.initialize();

  await assert.rejects(() => kernel.start());

  assert.deepEqual(first.calls, ["initialize", "start", "stop"]);
  assert.equal(kernel.getState(), KernelState.Failed);
});

test("kernel emits deterministic lifecycle events", async () => {
  const events: string[] = [];
  const kernel = new KernelBuilder()
    .withOptions({
      eventListeners: [
        (event) => {
          events.push(event.type);
        },
      ],
    })
    .addEngine(new TestEngine("engine"))
    .build();

  await kernel.initialize();
  await kernel.start();
  await kernel.stop();
  await kernel.dispose();

  assert.deepEqual(events, [
    "kernel-state-changed",
    "engine-initialized",
    "kernel-state-changed",
    "kernel-state-changed",
    "engine-started",
    "kernel-state-changed",
    "kernel-state-changed",
    "engine-stopped",
    "kernel-state-changed",
    "kernel-state-changed",
    "engine-disposed",
    "kernel-state-changed",
  ]);
});
