import assert from "node:assert/strict";
import test from "node:test";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CoreRouter,
} from "../src/router.js";

test(
  "application status aggregates services",
  async () => {
    const result =
      await new CoreRouter(
        createInMemoryCore(),
      ).dispatch(
        "application.status",
        {},
      ) as {
        readonly status: string;
        readonly phase: string;
        readonly services:
          readonly {
            readonly id: string;
          }[];
      };

    assert.equal(result.status, "ok");
    assert.equal(result.phase, "ready");
    assert.equal(
      result.services.some(
        (service) =>
          service.id === "search",
      ),
      true,
    );
  },
);

test(
  "application configuration is validated",
  async () => {
    const result =
      await new CoreRouter(
        createInMemoryCore(),
      ).dispatch(
        "application.configuration.validate",
        {},
      ) as {
        readonly valid: boolean;
        readonly issues: readonly unknown[];
      };

    assert.equal(
      typeof result.valid,
      "boolean",
    );
    assert.equal(
      Array.isArray(result.issues),
      true,
    );
  },
);
