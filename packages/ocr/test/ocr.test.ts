import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryOCRProvider,
  InMemoryOCRSession,
  OCREngine,
  OCRPipeline,
  TesseractPdfOcrProvider,
  verifyLocalOcrRuntime,
  OcrProcessError,
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

test("Tesseract PDF OCR uses fixed commands and never derives argv from filenames", async () => {
  const calls: Array<{ readonly executable: string; readonly args: readonly string[] }> = [];
  const provider = new TesseractPdfOcrProvider({
    temporaryRoot: "/tmp",
    readRaster: async () => bytes("png"),
    runner: async (command) => {
      calls.push(command);
      if (command.executable === "/usr/bin/pdfinfo") return { exitCode: 0, stdout: bytes("Pages: 1\n"), stderr: "" };
      if (command.executable === "/usr/bin/pdftoppm") return { exitCode: 0, stdout: bytes("png"), stderr: "" };
      return { exitCode: 0, stdout: bytes("Paper title\nBy Ada Lovelace\n"), stderr: "" };
    },
  });

  const result = await provider.recognizePdf({
    sourceId: "../../hostile;name.pdf",
    content: bytes("%PDF-1.7 scanned"),
  });

  assert.equal(result.text, "Paper title\nBy Ada Lovelace");
  assert.deepEqual(calls.map((call) => call.executable), ["/usr/bin/pdfinfo", "/usr/bin/pdftoppm", "/usr/bin/tesseract"]);
  assert.deepEqual(calls[1]?.args.slice(0, 8), ["-f", "1", "-l", "1", "-singlefile", "-r", "150", "-png"]);
  assert.match(calls[1]?.args[8] ?? "", /\/ocr-source\.pdf$/);
  assert.match(calls[1]?.args[9] ?? "", /\/ocr-page-1$/);
  assert.deepEqual(calls[2]?.args.slice(1, 6), ["stdout", "-l", "eng+spa", "--psm", "6"]);
  assert.match(calls[2]?.args[0] ?? "", /\/ocr-page-1\.png$/);
  assert.equal(calls.some((call) => call.args.join(" ").includes("hostile")), false);
});

test("Tesseract PDF OCR rejects byte and page limits before rasterization", async () => {
  const calls: string[] = [];
  const provider = new TesseractPdfOcrProvider({
    temporaryRoot: "/tmp",
    maxBytes: 3,
    runner: async (command) => { calls.push(command.executable); return { exitCode: 0, stdout: bytes("Pages: 2\n"), stderr: "" }; },
  });

  await assert.rejects(
    () => provider.recognizePdf({ sourceId: "scan", content: bytes("1234") }),
    (error) => error instanceof OcrProcessError && error.code === "ocr.limited",
  );
  assert.deepEqual(calls, []);

  const pageLimited = new TesseractPdfOcrProvider({
    temporaryRoot: "/tmp",
    maxPages: 1,
    runner: async (command) => {
      calls.push(command.executable);
      return { exitCode: 0, stdout: bytes("Pages: 2\n"), stderr: "" };
    },
  });
  await assert.rejects(
    () => pageLimited.recognizePdf({ sourceId: "scan", content: bytes("%PDF") }),
    (error) => error instanceof OcrProcessError && error.code === "ocr.limited",
  );
  assert.deepEqual(calls, ["/usr/bin/pdfinfo"]);
});

test("Tesseract PDF OCR classifies cancelled and failed local processes without exposing stderr", async () => {
  const cancelled = { aborted: true };
  const provider = new TesseractPdfOcrProvider({ temporaryRoot: "/tmp", runner: async () => ({ exitCode: 0, stdout: bytes(""), stderr: "secret path" }) });
  await assert.rejects(
    () => provider.recognizePdf({ sourceId: "scan", content: bytes("%PDF"), signal: cancelled }),
    (error) => error instanceof OcrProcessError && error.code === "ocr.cancelled" && !error.message.includes("secret"),
  );
  const failed = new TesseractPdfOcrProvider({
    temporaryRoot: "/tmp",
    runner: async () => ({ exitCode: 1, stdout: bytes(""), stderr: "/private/source.pdf credential" }),
  });
  await assert.rejects(
    () => failed.recognizePdf({ sourceId: "scan", content: bytes("%PDF") }),
    (error) => error instanceof OcrProcessError && error.code === "ocr.failed" && !error.message.includes("private"),
  );
});

test("local OCR runtime health requires Poppler plus English and Spanish language data", async () => {
  const healthy = await verifyLocalOcrRuntime(async (command) => {
    if (command.executable === "/usr/bin/tesseract") return { exitCode: 0, stdout: bytes("List of available languages in /usr/share/tessdata (2):\neng\nspa\n"), stderr: "" };
    return { exitCode: 0, stdout: bytes(""), stderr: "" };
  });
  assert.equal(healthy, true);

  const missingSpanish = await verifyLocalOcrRuntime(async () => ({ exitCode: 0, stdout: bytes("eng\n"), stderr: "" }));
  assert.equal(missingSpanish, false);
});
