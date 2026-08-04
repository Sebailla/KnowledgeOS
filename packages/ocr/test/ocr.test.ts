import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryOCRProvider,
  InMemoryOCRSession,
  OCREngine,
  OCRPipeline,
  ocrDocumentToSearchDocument,
} from "../src/index.js";
import {
  CancellationNone,
  CancellationSource,
} from "@knowledgeos/kernel";

function bytes(
  value: string,
): Uint8Array {
  return Uint8Array.from(
    [...value].map(
      (character) =>
        character.charCodeAt(0),
    ),
  );
}

const source = {
  id: "scan:1",
  mediaType: "image/png",
  content: bytes("KnowledgeOS OCR"),
  metadata: {
    fileName: "scan.png",
  },
};

test("in-memory session recognizes source", async () => {
  const document =
    await new InMemoryOCRSession()
      .recognize(source);

  assert.equal(
    document.text,
    "KnowledgeOS OCR",
  );
  assert.equal(
    document.pages.length,
    1,
  );
});

test("pipeline processes batch", async () => {
  const progress: number[] = [];

  const result =
    await new OCRPipeline(
      new InMemoryOCRProvider(),
    ).execute(
      [
        source,
        {
          ...source,
          id: "scan:2",
        },
      ],
      {
        onProgress(processed) {
          progress.push(processed);
        },
      },
    );

  assert.equal(result.documents.length, 2);
  assert.deepEqual(progress, [1, 2]);
});

test("pipeline supports cancellation", async () => {
  const cancellation =
    new CancellationSource();

  cancellation.cancel(
    new Error("cancelled"),
  );

  await assert.rejects(
    () =>
      new OCRPipeline(
        new InMemoryOCRProvider(),
      ).execute(
        [source],
        {
          cancellation:
            cancellation.token,
        },
      ),
  );
});

test("pipeline captures partial errors", async () => {
  const provider =
    new InMemoryOCRProvider({
      async recognize(item) {
        if (item.id === "scan:2") {
          throw new Error("failed");
        }

        return new InMemoryOCRSession()
          .recognize(item);
      },
      async close() {},
    });

  const result =
    await new OCRPipeline(provider)
      .execute(
        [
          source,
          {
            ...source,
            id: "scan:2",
          },
        ],
        {
          continueOnError: true,
        },
      );

  assert.equal(result.documents.length, 1);
  assert.equal(result.failures.length, 1);
});

test("ocr engine follows lifecycle", async () => {
  const engine =
    new OCREngine(
      new InMemoryOCRProvider(),
    );

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  const result =
    await engine.recognize([source]);

  assert.equal(result.documents.length, 1);

  await engine.stop(context);
  await engine.dispose(context);
});

test("ocr document projects to search", async () => {
  const document =
    await new InMemoryOCRSession()
      .recognize(source);

  const searchDocument =
    ocrDocumentToSearchDocument(
      document,
      "Scanned note",
      "2026-08-03T00:00:00.000Z",
    );

  assert.equal(
    searchDocument.metadata.pages,
    1,
  );
  assert.equal(
    searchDocument.body,
    "KnowledgeOS OCR",
  );
});

test("language option is preserved", async () => {
  const document =
    await new InMemoryOCRSession()
      .recognize(
        source,
        {
          languages: ["es"],
        },
      );

  assert.equal(
    document.pages[0]
      ?.blocks[0]
      ?.language,
    "es",
  );
});
