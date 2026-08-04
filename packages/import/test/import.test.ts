import assert from "node:assert/strict";
import test from "node:test";
import {
  DefaultFormatDetector,
  ImportEngine,
  ImportPipeline,
  InMemoryDeduplicationStore,
  InMemoryImportProvider,
  InMemoryImportSink,
  JsonTransformer,
  MarkdownTransformer,
  TextTransformer,
} from "../src/index.js";
import { CancellationNone } from "@knowledgeos/kernel";

function createPipeline() {
  return new ImportPipeline(
    new InMemoryImportProvider(),
    new DefaultFormatDetector(),
    new InMemoryDeduplicationStore(),
    new InMemoryImportSink(),
    undefined,
    [
      new MarkdownTransformer(),
      new TextTransformer(),
      new JsonTransformer(),
    ],
  );
}

test("detects markdown format", () => {
  const format =
    new DefaultFormatDetector().detect({
      id: "1",
      name: "note.md",
      extension: ".md",
      content: "# Note",
      metadata: {},
    });

  assert.equal(format, "markdown");
});

test("imports markdown document", async () => {
  const pipeline = createPipeline();

  const result = await pipeline.run([
    {
      id: "doc:1",
      name: "note.md",
      extension: ".md",
      content: "# KnowledgeOS\nBody",
      metadata: {},
    },
  ]);

  assert.equal(result.imported.length, 1);
  assert.equal(result.imported[0]?.title, "KnowledgeOS");
});

test("deduplicates repeated source", async () => {
  const pipeline = createPipeline();

  const source = {
    id: "doc:1",
    name: "note.txt",
    extension: ".txt",
    content: "Body",
    metadata: {},
  };

  await pipeline.run([source]);
  const second = await pipeline.run([source]);

  assert.equal(second.progress.skipped, 1);
});

test("continues after invalid source", async () => {
  const pipeline = createPipeline();

  const result = await pipeline.run([
    {
      id: "",
      name: "invalid.txt",
      extension: ".txt",
      content: "",
      metadata: {},
    },
    {
      id: "doc:2",
      name: "valid.txt",
      extension: ".txt",
      content: "Valid",
      metadata: {},
    },
  ]);

  assert.equal(result.failures.length, 1);
  assert.equal(result.imported.length, 1);
});

test("imports JSON document", async () => {
  const pipeline = createPipeline();

  const result = await pipeline.run([
    {
      id: "doc:json",
      name: "document.json",
      extension: ".json",
      content: JSON.stringify({
        title: "Structured",
        body: "Content",
      }),
      metadata: {},
    },
  ]);

  assert.equal(
    result.imported[0]?.title,
    "Structured",
  );
});

test("reports progress", async () => {
  const progress: number[] = [];
  const pipeline = createPipeline();

  await pipeline.run(
    [
      {
        id: "doc:1",
        name: "one.txt",
        extension: ".txt",
        content: "One",
        metadata: {},
      },
      {
        id: "doc:2",
        name: "two.txt",
        extension: ".txt",
        content: "Two",
        metadata: {},
      },
    ],
    {
      onProgress(value) {
        progress.push(value.completed);
      },
    },
  );

  assert.deepEqual(progress, [1, 2]);
});

test("engine follows kernel lifecycle", async () => {
  const engine =
    new ImportEngine(createPipeline());

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  const result = await engine.import([
    {
      id: "doc:1",
      name: "note.txt",
      extension: ".txt",
      content: "Body",
      metadata: {},
    },
  ]);

  assert.equal(result.imported.length, 1);

  await engine.stop(context);
  await engine.dispose(context);
});
