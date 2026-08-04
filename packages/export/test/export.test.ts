import assert from "node:assert/strict";
import test from "node:test";

import {
  EpubExportTransformer,
  ExportEngine,
  ExportPipeline,
  ExportTransformerRegistry,
  HtmlExportTransformer,
  InMemoryExportProvider,
  InMemoryExportWriter,
  MarkdownExportTransformer,
  PdfExportTransformer,
} from "../src/index.js";
import {
  CancellationNone,
  CancellationSource,
} from "@knowledgeos/kernel";

const source = {
  id: "document:1",
  title: "KnowledgeOS",
  body: "Offline first knowledge.",
  metadata: {
    type: "note",
  },
  assets: [],
};

test("markdown transformer creates artifact", async () => {
  const artifact =
    await new MarkdownExportTransformer()
      .transform(
        source,
        {
          cancellation: CancellationNone,
          metadata: {},
        },
      );

  assert.equal(artifact.format, "markdown");
  assert.equal(
    artifact.content.includes("# KnowledgeOS"),
    true,
  );
});

test("html transformer escapes content", async () => {
  const artifact =
    await new HtmlExportTransformer()
      .transform(
        {
          ...source,
          body: "<script>",
        },
        {
          cancellation: CancellationNone,
          metadata: {},
        },
      );

  assert.equal(
    artifact.content.includes("&lt;script&gt;"),
    true,
  );
});

test("pipeline exports batch and reports progress", async () => {
  const registry =
    new ExportTransformerRegistry();

  registry.register(
    new MarkdownExportTransformer(),
  );

  const writer =
    new InMemoryExportWriter();

  const progress: number[] = [];

  const result =
    await new ExportPipeline(registry)
      .execute(
        [
          source,
          {
            ...source,
            id: "document:2",
            title: "Second",
          },
        ],
        "markdown",
        writer,
        {
          onProgress(processed) {
            progress.push(processed);
          },
        },
      );

  assert.equal(result.artifacts.length, 2);
  assert.deepEqual(progress, [1, 2]);
  assert.equal(writer.list().length, 2);
});

test("pipeline supports partial failures", async () => {
  const registry =
    new ExportTransformerRegistry();

  registry.register({
    format: "markdown",
    async transform(item, context) {
      if (item.id === "document:2") {
        throw new Error("failed");
      }

      return new MarkdownExportTransformer()
        .transform(item, context);
    },
  });

  const result =
    await new ExportPipeline(registry)
      .execute(
        [
          source,
          {
            ...source,
            id: "document:2",
          },
        ],
        "markdown",
        new InMemoryExportWriter(),
        {
          continueOnError: true,
        },
      );

  assert.equal(result.artifacts.length, 1);
  assert.equal(result.failures.length, 1);
});

test("pdf and epub require external providers", async () => {
  await assert.rejects(
    () =>
      new PdfExportTransformer()
        .transform(
          source,
          {
            cancellation: CancellationNone,
            metadata: {},
          },
        ),
  );

  await assert.rejects(
    () =>
      new EpubExportTransformer()
        .transform(
          source,
          {
            cancellation: CancellationNone,
            metadata: {},
          },
        ),
  );
});

test("export engine follows lifecycle", async () => {
  const provider =
    new InMemoryExportProvider();

  const engine =
    new ExportEngine(provider);

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  const result =
    await engine.export(
      [source],
      "markdown",
    );

  assert.equal(result.artifacts.length, 1);
  assert.equal(
    provider.writer.list().length,
    1,
  );

  await engine.stop(context);
  await engine.dispose(context);
});

test("pipeline responds to cancellation", async () => {
  const registry =
    new ExportTransformerRegistry();

  registry.register(
    new MarkdownExportTransformer(),
  );

  const cancellationSource =
    new CancellationSource();

  cancellationSource.cancel(
    new Error("cancelled"),
  );

  await assert.rejects(
    () =>
      new ExportPipeline(registry)
        .execute(
          [source],
          "markdown",
          new InMemoryExportWriter(),
          {
            cancellation: cancellationSource.token,
          },
        ),
  );
});
