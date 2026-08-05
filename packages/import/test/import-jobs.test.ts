import assert from "node:assert/strict";
import test from "node:test";

import {
  ImportJobManager,
  detectFormat,
} from "../src/index.js";

test(
  "detects supported formats",
  () => {
    assert.equal(
      detectFormat({
        name: "paper.pdf",
        content: "pdf",
      }),
      "pdf",
    );

    assert.equal(
      detectFormat({
        name: "notes.md",
        content: "# Notes",
      }),
      "markdown",
    );

    assert.equal(
      detectFormat({
        name: "book.epub",
        content: "epub",
      }),
      "epub",
    );
  },
);

test(
  "preview extracts title and checksum",
  () => {
    const manager =
      new ImportJobManager();

    const preview = manager.detect({
      name: "notes.md",
      content: "# Research Notes\nBody",
    });

    assert.equal(
      preview.title,
      "Research Notes",
    );
    assert.equal(
      preview.checksum.length,
      64,
    );
    assert.equal(
      preview.duplicate,
      false,
    );
  },
);

test(
  "completed import is detected as duplicate",
  () => {
    const manager =
      new ImportJobManager();

    const input = {
      name: "notes.txt",
      content: "same content",
    };

    const completed =
      manager.start(input);

    assert.equal(
      completed.state,
      "completed",
    );

    const duplicate =
      manager.start(input);

    assert.equal(
      duplicate.state,
      "failed",
    );
  },
);
