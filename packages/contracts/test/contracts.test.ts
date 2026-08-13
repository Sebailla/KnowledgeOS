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
