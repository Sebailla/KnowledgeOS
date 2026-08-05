import assert from "node:assert/strict";
import test from "node:test";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CoreRouter,
} from "../src/router.js";

test(
  "import preview and start work",
  async () => {
    const router =
      new CoreRouter(
        createInMemoryCore(),
      );

    const preview =
      await router.dispatch(
        "import.preview",
        {
          name: "notes.md",
          content:
            "# Knowledge Notes\nText",
        },
      ) as {
        readonly format: string;
        readonly title: string;
      };

    assert.equal(
      preview.format,
      "markdown",
    );
    assert.equal(
      preview.title,
      "Knowledge Notes",
    );

    const job =
      await router.dispatch(
        "import.start",
        {
          name: "notes.md",
          content:
            "# Knowledge Notes\nText",
        },
      ) as {
        readonly state: string;
        readonly progress: number;
      };

    assert.equal(
      job.state,
      "completed",
    );
    assert.equal(
      job.progress,
      1,
    );
  },
);
