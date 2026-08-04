import assert from "node:assert/strict";
import test from "node:test";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CancellationNone,
} from "@knowledgeos/kernel";
import {
  InMemoryAIProvider,
} from "@knowledgeos/ai";

import {
  CoreRouter,
  HostError,
} from "../src/router.js";

const context = {
  cancellation: CancellationNone,
  metadata: {},
};

test("health route works", async () => {
  const core = createInMemoryCore();

  await core.ai.registerProvider(
    new InMemoryAIProvider(),
  );

  await core.runtime.initialize(context);
  await core.runtime.start(context);

  const result =
    await new CoreRouter(core)
      .dispatch(
        "core.health",
        {},
      ) as {
        readonly status: string;
      };

  assert.equal(result.status, "ok");

  await core.runtime.stop(context);
  await core.runtime.dispose(context);
});

test("unknown route fails", async () => {
  const core = createInMemoryCore();

  await core.runtime.initialize(context);
  await core.runtime.start(context);

  await assert.rejects(
    () =>
      new CoreRouter(core)
        .dispatch("missing", {}),
    HostError,
  );

  await core.runtime.stop(context);
  await core.runtime.dispose(context);
});
