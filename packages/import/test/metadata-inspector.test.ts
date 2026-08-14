import assert from "node:assert/strict";
import test from "node:test";
import { strToU8, zipSync } from "fflate";
import { inspectPublication } from "../src/index.js";

const bytes = (source: string) => {
  const output = new Uint8Array(source.length);
  for (let index = 0; index < source.length; index += 1) output[index] = source.charCodeAt(index);
  return output;
};

const pdf = (options: { readonly title?: string; readonly author?: string; readonly xmp?: string; readonly text?: string } = {}) => {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R" + (options.xmp ? " /Metadata 6 0 R" : "") + " >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${options.text?.length ?? 0} >>\nstream\n${options.text ?? ""}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ...(options.xmp ? [`<< /Type /Metadata /Subtype /XML /Length ${options.xmp.length} >>\nstream\n${options.xmp}\nendstream`] : []),
    ...(options.title || options.author ? [`<<${options.title ? ` /Title (${options.title})` : ""}${options.author ? ` /Author (${options.author})` : ""} >>`] : []),
  ];
  let output = "%PDF-1.7\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) { offsets.push(output.length); output += `${index + 1} 0 obj\n${object}\nendobj\n`; }
  const xref = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R${options.title || options.author ? ` /Info ${objects.length} 0 R` : ""} >>\nstartxref\n${xref}\n%%EOF`;
  return output;
};

const inspect = (source: string, originalFilename = "untitled-document.pdf") => inspectPublication({
  metadata: {
    originalFilename,
    declaredMediaType: "application/pdf",
    byteLength: bytes(source).byteLength,
  },
  source: bytes(source),
});

test("prefers embedded PDF metadata over first-page text and filename", async () => {
  const result = await inspect(pdf({ title: "Embedded Title", author: "Ada Lovelace", text: "BT /F1 24 Tf 72 720 Td (First page title) Tj ET" }), "lower-priority-title.pdf");

  assert.equal(result.title?.value, "Embedded Title");
  assert.equal(result.title?.evidence, "pdf-info");
  assert.deepEqual(result.authors?.map((author) => author.value), ["Ada Lovelace"]);
  assert.equal(result.candidates.some((candidate) => candidate.evidence === "filename" && candidate.field === "title"), true);
});

test("returns ranked candidates with an explicit target field", async () => {
  const result = await inspect(pdf({ title: "Embedded Title", author: "Ada Lovelace", xmp: `<?xpacket begin=""?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title><rdf:Alt><rdf:li xml:lang="x-default">XMP Title</rdf:li></rdf:Alt></dc:title><dc:creator><rdf:Seq><rdf:li>Grace Hopper</rdf:li></rdf:Seq></dc:creator></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>` }), "filename-fallback.pdf");

  assert.deepEqual(result.candidates.map(({ value, field }) => ({ value, field })), [
    { value: "XMP Title", field: "title" },
    { value: "filename fallback", field: "title" },
    { value: "Grace Hopper", field: "authors" },
  ]);
});

test("recovers only missing PDF fields from first-page text without OCR", async () => {
  const result = await inspect(pdf({ title: "Embedded Title", text: "BT /F1 24 Tf 72 720 Td (Ada Lovelace and Grace Hopper) Tj ET" }));

  assert.equal(result.title?.evidence, "pdf-info");
  assert.deepEqual(result.authors?.map((author) => author.value), ["Ada Lovelace", "Grace Hopper"]);
  assert.equal(result.authors?.every((author) => author.evidence === "first-page-text"), true);
  assert.equal(result.outcome, "completed");
});

test("recovers XMP and EPUB OPF metadata with their own provenance", async () => {
  const xmp = await inspect(pdf({ xmp: `<?xpacket begin=""?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title><rdf:Alt><rdf:li xml:lang="x-default">XMP Title</rdf:li></rdf:Alt></dc:title><dc:creator><rdf:Seq><rdf:li>Grace Hopper</rdf:li></rdf:Seq></dc:creator></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>` }));
  assert.equal(xmp.title?.evidence, "pdf-xmp");
  assert.deepEqual(xmp.authors?.map(author => author.value), ["Grace Hopper"]);

  const epub = zipSync({
    "META-INF/container.xml": strToU8(`<?xml version="1.0"?><container><rootfiles><rootfile full-path="OPS/book.opf"/></rootfiles></container>`),
    "OPS/book.opf": strToU8(`<?xml version="1.0"?><package><metadata><dc:title>OPF Title</dc:title><dc:creator>Ada Lovelace</dc:creator></metadata></package>`),
  });
  const result = await inspectPublication({ metadata: { originalFilename: "fallback.epub", declaredMediaType: "application/epub+zip", byteLength: epub.byteLength }, source: epub });
  assert.equal(result.title?.value, "OPF Title");
  assert.equal(result.title?.evidence, "epub-opf");
  assert.deepEqual(result.authors?.map(author => author.value), ["Ada Lovelace"]);
});

test("falls back to a normalized filename when PDF evidence is unusable", async () => {
  const result = await inspect(pdf(), "1999_Barbodes--Smith_et_al.pdf");

  assert.equal(result.title?.value, "1999 Barbodes Smith et al");
  assert.equal(result.title?.evidence, "filename");
  assert.equal(result.title?.confidence, "low");
  assert.equal(result.outcome, "partial");
});

test("does not treat xref rows or scanner placeholders as publication metadata", async () => {
  const result = await inspect(pdf({ author: "<unknown> [ DBSYAN01 ]", text: "BT /F1 24 Tf 72 720 Td (0000000506 00000 n) Tj ET" }), "1999Barbodes.pdf");

  assert.equal(result.title?.value, "1999Barbodes");
  assert.equal(result.title?.evidence, "filename");
  assert.equal(result.authors, undefined);
  assert.equal(result.outcome, "partial");
});

test("uses local OCR only when deterministic PDF evidence leaves required metadata missing", async () => {
  let calls = 0;
  const source = pdf();
  const result = await inspectPublication({
    metadata: { originalFilename: "scanned-paper.pdf", declaredMediaType: "application/pdf", byteLength: bytes(source).byteLength },
    source: bytes(source),
    ocr: {
      async recognizePdf(request) {
        calls += 1;
        assert.equal(new Uint8Array(request.content).byteLength > 0, true);
        return { text: "Scanned Paper\nBy Ada Lovelace", pages: 1 };
      },
    },
  });

  assert.equal(calls, 1);
  assert.equal(result.title?.value, "scanned paper");
  assert.deepEqual(result.authors?.map((author) => author.value), ["Ada Lovelace"]);
  assert.equal(result.authors?.[0]?.evidence, "local-ocr");
  assert.equal(result.outcome, "completed");
});

test("returns a redacted limited OCR outcome and keeps deterministic manual fallback", async () => {
  const source = pdf();
  const result = await inspectPublication({
    metadata: { originalFilename: "scanned-paper.pdf", declaredMediaType: "application/pdf", byteLength: bytes(source).byteLength },
    source: bytes(source),
    ocr: {
      async recognizePdf() {
        throw Object.assign(new Error("/private/secret.pdf"), { code: "ocr.limited" });
      },
    },
  });

  assert.equal(result.title?.value, "scanned paper");
  assert.equal(result.authors, undefined);
  assert.equal(result.outcome, "ocr-limited");
});

test("rejects malformed or unsupported inspection input without leaking source details", async () => {
  await assert.rejects(
    () => inspectPublication({
      metadata: { originalFilename: "secrets.pdf", declaredMediaType: "application/pdf", byteLength: 12 },
      source: bytes("not a PDF"),
    }),
    (error: unknown) => error instanceof Error && error.name === "InspectionValidationError" && !error.message.includes("secrets.pdf"),
  );
});
