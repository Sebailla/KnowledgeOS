import assert from "node:assert/strict";
import test from "node:test";
import {
  acceptedProvenance,
  candidatesForField,
  metadataForSource,
  provenanceForAppliedSuggestions,
  shouldApplySuggestion,
} from "../public/metadata-review.js";

test("builds local inspection metadata for PDF and EPUB sources only", () => {
  assert.deepEqual(metadataForSource({ name: "paper.pdf", type: "", size: 10 }), { originalFilename: "paper.pdf", declaredMediaType: "application/pdf", byteLength: 10 });
  assert.deepEqual(metadataForSource({ name: "book.epub", type: "application/epub+zip", size: 20 }), { originalFilename: "book.epub", declaredMediaType: "application/epub+zip", byteLength: 20 });
  assert.equal(metadataForSource({ name: "notes.txt", type: "text/plain", size: 2 }), undefined);
});

test("preserves a user-corrected field and records it as user-entered", () => {
  const result = { title: { value: "Recovered title", evidence: "pdf-xmp", confidence: "high" }, authors: [{ value: "Recovered author", evidence: "pdf-info", confidence: "high" }] };
  assert.equal(shouldApplySuggestion(true, result.title.value), false);
  assert.deepEqual(acceptedProvenance(result, false, true), {
    title: { evidence: "user-entered", confidence: "high" },
    authors: [{ evidence: "pdf-info", confidence: "high" }],
  });
});

test("manual fallback never serializes extracted values or paths", () => {
  const fallback = acceptedProvenance(undefined, false, false);
  assert.deepEqual(fallback, { title: { evidence: "user-entered", confidence: "high" }, authors: [{ evidence: "user-entered", confidence: "high" }] });
  assert.equal(JSON.stringify(fallback).includes("/"), false);
});

test("separates ranked candidate fields and retains the explicitly selected provenance", () => {
  const result = {
    candidates: [
      { value: "Possible title", evidence: "first-page-text", confidence: "medium", field: "title" },
      { value: "Ada Lovelace", evidence: "local-ocr", confidence: "medium", field: "authors" },
    ],
  };

  assert.deepEqual(candidatesForField(result, "title"), [result.candidates[0]]);
  assert.deepEqual(candidatesForField(result, "authors"), [result.candidates[1]]);
  assert.deepEqual(provenanceForAppliedSuggestions(result.candidates[0], [result.candidates[1]]), {
    title: { evidence: "first-page-text", confidence: "medium" },
    authors: [{ evidence: "local-ocr", confidence: "medium" }],
  });
});

import { sourcePreviewFor } from "../public/source-preview.js";

test("classifies local-only first-page preview states without source paths or bytes", () => {
  assert.deepEqual(sourcePreviewFor(undefined), { kind: "empty", message: "Choose a PDF to preview its first page locally." });
  assert.equal(sourcePreviewFor({ name: "paper.pdf", type: "" }).kind, "pdf");
  assert.equal(sourcePreviewFor({ name: "book.epub", type: "application/epub+zip" }).kind, "unsupported");
  assert.equal(JSON.stringify(sourcePreviewFor({ name: "paper.pdf", type: "application/pdf" })).includes("/"), false);
});
