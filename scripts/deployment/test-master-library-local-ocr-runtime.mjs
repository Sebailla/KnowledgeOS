import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const image = process.env.MASTER_LIBRARY_OCR_IMAGE ?? "knowledgeos/master-library:ocr-slice3-test";

const fixture = new URL("../../packages/import/test/fixtures/scanned-paper.pdf", import.meta.url).pathname;

// The checked-in fixture contains only a JPEG image XObject. PDF.js cannot
// extract its text, so this exercises the local Poppler + Tesseract fallback.
const program = String.raw`
import { inspectPublication } from '/app/workspace/packages/import/dist/metadata/inspectPublication.js';
import { TesseractPdfOcrProvider } from '/app/workspace/packages/ocr/dist/tesseract/TesseractPdfOcrProvider.js';
import { readFileSync } from 'node:fs';
const source = new Uint8Array(readFileSync('/fixture.pdf'));
const ocr = new TesseractPdfOcrProvider();
let failure;
const result = await inspectPublication({ metadata: { originalFilename: 'scan.pdf', declaredMediaType: 'application/pdf', byteLength: source.byteLength }, source, ocr: { async recognizePdf(request) { try { return await ocr.recognizePdf(request); } catch (error) { failure = { code: error.code, message: error.message }; throw error; } } } });
console.log(JSON.stringify({ result, failure }));
`;

const output = execFileSync(
  "docker",
  ["run", "--rm", "--network", "none", "-i", "-v", `${fixture}:/fixture.pdf:ro`, "--entrypoint", "node", image, "--input-type=module", "-"],
  { input: program, encoding: "utf8", timeout: 30_000 },
);
const { result, failure } = JSON.parse(output.trim());
assert.match(result.candidates?.[0]?.value ?? "", /SCANNED\s+PAPER/i, JSON.stringify({ result, failure }));
assert.equal(result.authors?.[0]?.evidence, "local-ocr", JSON.stringify(result));
assert.match(result.authors?.[0]?.value ?? "", /ADA\s+LOVELACE/i);
assert.equal(result.outcome, "completed");
console.log(JSON.stringify({ harness: "master-library-local-ocr-runtime", image, status: "passed", outcome: result.outcome }));
