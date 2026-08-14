import assert from "node:assert/strict";
import test from "node:test";
import type {
  AcquisitionManifest,
  AcquisitionHandoffAcceptedV1,
  InitiateAcquisitionV1,
  BrowseMasterCatalogQuery,
  CreateAnnotationCommand,
  MasterCatalogPage,
  MasterLibraryContentAlias,
  MasterLibraryError,
  IngestPublicationV1,
  IngestAcceptedV1,
  IngestOperationStatusV1,
  InspectPublicationResultV1,
  IngestSourceMetadataV1,
  MetadataEvidence,
  SearchQuery,
} from "../src/index.js";

test("contract types remain structurally serializable", () => {
  const values: readonly unknown[] = [
    {} satisfies Partial<BrowseMasterCatalogQuery>,
    {} satisfies Partial<CreateAnnotationCommand>,
    {} satisfies Partial<SearchQuery>,
  ];
  assert.equal(JSON.stringify(values), "[{},{},{}]");
});

test("Master Library v1 contracts preserve catalog identity and reject Personal Knowledge", () => {
  const page = {
    protocolVersion: "v1",
    items: [],
    nextCursor: "publication:cursor-0001",
  } satisfies MasterCatalogPage;
  const manifest = {
    protocolVersion: "v1",
    publicationId: "publication:master-0001" as never,
    knowledgeObjectId: "knowledge-object:master-0001" as never,
    versionId: "version:master-0001" as never,
    contentFingerprint: "sha256:abc123",
    byteLength: 42,
    mediaType: "application/pdf",
  } satisfies AcquisitionManifest;
  const alias = {
    deprecatedPath: "/master-library/publications/publication%3Amaster-0001/versions/version%3Amaster-0001/content",
    canonicalPath: "/v1/master-library/publications/publication%3Amaster-0001/versions/version%3Amaster-0001/content",
    sunsetAfter: "2027-01-01",
  } satisfies MasterLibraryContentAlias;
  const rejection = {
    code: "master-library.personal-knowledge-forbidden",
    correlationId: "correlation:master-0001",
  } satisfies MasterLibraryError;

  assert.equal(JSON.stringify(page), '{"protocolVersion":"v1","items":[],"nextCursor":"publication:cursor-0001"}');
  assert.equal(manifest.contentFingerprint, "sha256:abc123");
  assert.equal(alias.canonicalPath.startsWith("/v1/master-library/"), true);
  assert.equal(rejection.code, "master-library.personal-knowledge-forbidden");
});

test("Master Library v1 acquisition initiation preserves only Master handoff data", () => {
  const command = {
    publicationId: "publication:master-0001" as never,
    versionId: "version:master-0001" as never,
    targetLocalLibraryId: "local-library:reader-0001" as never,
  } satisfies InitiateAcquisitionV1;
  const manifest = {
    protocolVersion: "v1",
    publicationId: command.publicationId,
    knowledgeObjectId: "knowledge-object:master-0001" as never,
    versionId: command.versionId,
    contentFingerprint: "sha256:abc123",
    byteLength: 42,
    mediaType: "application/pdf",
  } satisfies AcquisitionManifest;
  const accepted = {
    receipt: {
      acquisitionId: "acquisition:master-0001" as never,
      idempotencyKey: "idempotency:master-0001",
      accepted: true,
    },
    manifest,
  } satisfies AcquisitionHandoffAcceptedV1;

  assert.equal(accepted.receipt.accepted, true);
  assert.equal(accepted.manifest.versionId, command.versionId);
  assert.equal(JSON.stringify(accepted).includes("personal"), false);
  assert.equal(JSON.stringify(accepted).includes("descriptor"), false);

  const errors = [
    { code: "validation.failed", correlationId: "correlation:validation" },
    { code: "operation.conflict", correlationId: "correlation:conflict" },
    { code: "authorization.denied", correlationId: "correlation:authorization" },
  ] satisfies readonly MasterLibraryError[];
  assert.equal(errors.map((error) => error.code).join(","), "validation.failed,operation.conflict,authorization.denied");
});

test("Master Library ingest v1 contracts expose opaque accepted identifiers and safe status", () => {
  const request = {
    idempotencyKey: "ingest-request:8cc42d0a",
    metadata: {
      title: "The Architecture of Knowledge",
      authors: ["Ada Lovelace"],
      originalFilename: "knowledge.pdf",
      declaredMediaType: "application/pdf",
      byteLength: 42,
    },
  } satisfies IngestPublicationV1;
  const accepted = {
    operationId: "ingest-operation:7f519c7b" as never,
    publicationId: "publication:4c1843ea" as never,
    versionId: "version:2c936ffc" as never,
    knowledgeObjectId: "knowledge-object:911a4f42" as never,
    outcome: "registered",
  } satisfies IngestAcceptedV1;
  const status = {
    operationId: accepted.operationId,
    state: "registered",
    outcome: accepted.outcome,
  } satisfies IngestOperationStatusV1;
  const errors = [
    { code: "ingest.validation-failed", correlationId: "correlation:validation" },
    { code: "ingest.idempotency-conflict", correlationId: "correlation:conflict" },
  ] satisfies readonly MasterLibraryError[];

  assert.equal(request.metadata.originalFilename, "knowledge.pdf");
  assert.equal(JSON.stringify(accepted).includes("knowledge.pdf"), false);
  assert.equal(status.state, "registered");
  assert.equal(errors.map((error) => error.code).join(","), "ingest.validation-failed,ingest.idempotency-conflict");
});

test("Master Library inspection v1 contracts preserve local evidence and redacted outcomes", () => {
  const title = {
    value: "The Architecture of Knowledge",
    evidence: "pdf-xmp",
    confidence: "high",
  } satisfies InspectPublicationResultV1["title"];
  const inspected = {
    title,
    authors: [{ value: "Ada Lovelace", evidence: "pdf-info", confidence: "high" }],
    candidates: [{ value: "knowledge", evidence: "filename", confidence: "low" }],
    correlationId: "correlation:inspection",
    outcome: "completed",
  } satisfies InspectPublicationResultV1;
  const evidence = ["pdf-info", "pdf-xmp", "epub-opf", "first-page-text", "filename", "local-ocr", "user-entered"] satisfies readonly MetadataEvidence[];
  const errors = [
    { code: "inspection.validation-failed", correlationId: inspected.correlationId },
    { code: "inspection.capacity-exceeded", correlationId: inspected.correlationId },
    { code: "inspection.cancelled", correlationId: inspected.correlationId },
    { code: "ocr.unavailable", correlationId: inspected.correlationId },
    { code: "ocr.limited", correlationId: inspected.correlationId },
    { code: "ocr.failed", correlationId: inspected.correlationId },
  ] satisfies readonly MasterLibraryError[];

  assert.equal(inspected.title?.evidence, "pdf-xmp");
  assert.equal(inspected.candidates[0]?.confidence, "low");
  assert.equal(evidence.length, 7);
  assert.equal(errors.every((error) => !JSON.stringify(error).includes("/")), true);
});

test("ingest metadata records accepted local evidence without storing extracted content", () => {
  const metadata = {
    title: "The Architecture of Knowledge",
    authors: ["Ada Lovelace"],
    originalFilename: "knowledge.pdf",
    declaredMediaType: "application/pdf",
    byteLength: 42,
    acceptedProvenance: {
      title: { evidence: "pdf-xmp", confidence: "high" },
      authors: [{ evidence: "user-entered", confidence: "high" }],
    },
  } satisfies IngestSourceMetadataV1;

  assert.equal(metadata.acceptedProvenance?.title.evidence, "pdf-xmp");
  assert.equal(JSON.stringify(metadata.acceptedProvenance).includes("/"), false);
  assert.equal(JSON.stringify(metadata.acceptedProvenance).includes("OCR text"), false);
});
