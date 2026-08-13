import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryIngestValidator,
  validateIngestSource,
} from "../src/index.js";

const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const epub = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x6d, 0x69, 0x6d, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6c, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2f, 0x65, 0x70, 0x75, 0x62, 0x2b, 0x7a, 0x69, 0x70]);

const metadata = {
  title: "A Book",
  authors: ["Ada"],
  originalFilename: "a-book.pdf",
  declaredMediaType: "application/pdf" as const,
  byteLength: pdf.byteLength,
};

test("validates matching PDF and EPUB evidence within the configured limit", () => {
  const acceptedPdf = validateIngestSource(pdf, metadata, { maxBytes: 1024 });
  const acceptedEpub = validateIngestSource(epub, { ...metadata, originalFilename: "a-book.epub", declaredMediaType: "application/epub+zip", byteLength: epub.byteLength }, { maxBytes: 1024 });

  assert.equal(acceptedPdf.mediaType, "application/pdf");
  assert.equal(acceptedPdf.contentFingerprint.startsWith("sha256:"), true);
  assert.equal(acceptedEpub.mediaType, "application/epub+zip");
  assert.equal(acceptedEpub.byteLength, epub.byteLength);
});

test("rejects mismatched signatures and path-like provenance", async () => {
  await assert.rejects(() => Promise.resolve().then(() => validateIngestSource(new Uint8Array([0]), metadata, { maxBytes: 1024 })), /IngestValidationError/);
  await assert.rejects(() => Promise.resolve().then(() => validateIngestSource(pdf, { ...metadata, originalFilename: "../unsafe.pdf" }, { maxBytes: 1024 })), /IngestValidationError/);
});

test("classifies a configured source-size limit as capacity", async () => {
  await assert.rejects(() => Promise.resolve().then(() => validateIngestSource(pdf, metadata, { maxBytes: 4 })), /IngestCapacityError/);
});

test("retains checksum duplicate evidence while replaying an equivalent idempotency key", async () => {
  const validator = new InMemoryIngestValidator({ maxBytes: 1024 });
  const first = validator.accept({ subject: "operator:one", idempotencyKey: "ingest:one", bytes: pdf, metadata });
  const replay = validator.accept({ subject: "operator:one", idempotencyKey: "ingest:one", bytes: pdf, metadata });

  assert.equal(replay.contentFingerprint, first.contentFingerprint);
  assert.equal(replay.outcome, "registered");
  await assert.rejects(() => Promise.resolve().then(() => validator.accept({ subject: "operator:two", idempotencyKey: "ingest:two", bytes: pdf, metadata })), /IngestDuplicateContentError/);
  assert.equal(validator.duplicateEvidence().length, 1);
});

test("rejects a changed idempotency replay instead of accepting a second semantic request", async () => {
  const validator = new InMemoryIngestValidator({ maxBytes: 1024 });
  validator.accept({ subject: "operator:one", idempotencyKey: "ingest:one", bytes: pdf, metadata });

  await assert.rejects(() => Promise.resolve().then(() => validator.accept({ subject: "operator:one", idempotencyKey: "ingest:one", bytes: pdf, metadata: { ...metadata, title: "Changed" } })), /IngestIdempotencyConflictError/);
});
