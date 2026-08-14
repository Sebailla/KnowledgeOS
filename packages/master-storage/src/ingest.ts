import { createHash, randomUUID } from "node:crypto";
import { access, appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { IngestAcceptedV1, IngestOperationStatusV1, IngestSourceMetadataV1, MasterCatalogPage } from "@knowledgeos/contracts";

export interface IngestValidationPolicy {
  readonly maxBytes: number;
}

export interface ValidatedIngestSource {
  readonly mediaType: IngestSourceMetadataV1["declaredMediaType"];
  readonly byteLength: number;
  readonly contentFingerprint: string;
}

export interface IngestValidationRequest {
  readonly subject: string;
  readonly idempotencyKey: string;
  readonly bytes: Uint8Array;
  readonly metadata: IngestSourceMetadataV1;
}

export interface IngestValidationResult extends ValidatedIngestSource {
  readonly outcome: "registered";
}

export interface DuplicateIngestEvidence {
  readonly subject: string;
  readonly idempotencyKey: string;
  readonly contentFingerprint: string;
}

export class IngestValidationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "IngestValidationError";
  }
}

/** A configured source-size limit is a capacity outcome, not malformed input. */
export class IngestCapacityError extends Error {
  public constructor() {
    super("Source exceeds the configured byte limit.");
    this.name = "IngestCapacityError";
  }
}

export class IngestIdempotencyConflictError extends Error {
  public constructor() {
    super("Ingest idempotency key conflicts with a different request.");
    this.name = "IngestIdempotencyConflictError";
  }
}

export class IngestDuplicateContentError extends Error {
  public constructor() {
    super("Authoritative content is already registered.");
    this.name = "IngestDuplicateContentError";
  }
}

export type AuthoritativeIngestState = IngestOperationStatusV1["state"];

export interface AuthoritativeIngestRecord {
  readonly operationId: string;
  readonly subject: string;
  readonly correlationId: string;
  readonly idempotencyKey: string;
  readonly requestFingerprint: string;
  readonly publicationId: string;
  readonly versionId: string;
  readonly knowledgeObjectId: string;
  readonly sourceItemId: string;
  readonly metadata: IngestSourceMetadataV1;
  readonly contentFingerprint: string;
  readonly relativePath: string;
  readonly state: AuthoritativeIngestState;
}

export interface AuthoritativeIngestRepository {
  claim(record: AuthoritativeIngestRecord): Promise<AuthoritativeIngestRecord>;
  transition(operationId: string, state: AuthoritativeIngestState): Promise<void>;
  register(record: AuthoritativeIngestRecord): Promise<void>;
  hide(operationId: string): Promise<void>;
  status(operationId: string): Promise<IngestOperationStatusV1 | undefined>;
  incomplete(): Promise<readonly AuthoritativeIngestRecord[]>;
}

export interface AuthoritativeIngestRequest extends IngestValidationRequest {
  readonly correlationId: string;
  /** Test-only interruption point; production callers never set it. */
  readonly interruptAfter?: "promoted";
}

export interface AuthoritativeIngestStreamRequest extends Omit<AuthoritativeIngestRequest, "bytes"> {
  readonly source: AsyncIterable<Uint8Array>;
}

/**
 * Promotes validated source bytes inside the authoritative root. A journal
 * claim happens before promotion; recovery can therefore decide visibility
 * from the final file and durable evidence without deleting either.
 */
export class AuthoritativeIngestService {
  public constructor(
    private readonly repository: AuthoritativeIngestRepository,
    private readonly root: string,
    private readonly policy: IngestValidationPolicy,
  ) {}

  public async accept(request: AuthoritativeIngestRequest): Promise<IngestAcceptedV1> {
    return this.acceptStream({ ...request, source: (async function* () { yield request.bytes; })() });
  }

  /** Writes the source as it arrives; only signature evidence is retained in memory. */
  public async acceptStream(request: AuthoritativeIngestStreamRequest): Promise<IngestAcceptedV1> {
    const ids = createIds();
    const stagingRoot = join(this.root, "staging", ids.operationId);
    const staged = join(stagingRoot, "source");
    await mkdir(stagingRoot, { recursive: true });
    const validated = await validateAndStageIngestSource(request.source, staged, request.metadata, this.policy);
    const record: AuthoritativeIngestRecord = {
      ...ids,
      subject: request.subject,
      correlationId: request.correlationId,
      idempotencyKey: request.idempotencyKey,
      requestFingerprint: fingerprintStreamRequest(request, validated.contentFingerprint),
      metadata: request.metadata,
      contentFingerprint: validated.contentFingerprint,
      relativePath: join("publications", ids.publicationId, ids.versionId, "content"),
      state: "staged",
    };
    const claimed = await this.repository.claim(record);
    const replay = claimed.operationId !== record.operationId;
    if (replay) {
      const sameIdempotencyRequest = claimed.subject === request.subject && claimed.idempotencyKey === request.idempotencyKey;
      if (sameIdempotencyRequest) {
        if (claimed.requestFingerprint !== record.requestFingerprint) throw new IngestIdempotencyConflictError();
        return accepted(claimed, claimed.state === "registered" ? "registered" : "duplicate");
      }
      return accepted(claimed, "duplicate");
    }

    await this.repository.transition(record.operationId, "validated");
    await mkdir(join(this.root, "publications", record.publicationId, record.versionId), { recursive: true });
    await rename(staged, this.finalPath(record));
    await this.repository.transition(record.operationId, "promoted");
    if (request.interruptAfter === "promoted") return accepted(record, "registered");
    await this.repository.register({ ...record, state: "promoted" });
    await this.repository.transition(record.operationId, "registered");
    return accepted(record, "registered");
  }

  public async reconcile(): Promise<void> {
    for (const record of await this.repository.incomplete()) {
      const finalPresent = await exists(this.finalPath(record));
      if (finalPresent && await fingerprintMatches(this.finalPath(record), record.contentFingerprint)) {
        await this.repository.register({ ...record, state: "promoted" });
        await this.repository.transition(record.operationId, "registered");
      } else {
        await this.repository.hide(record.operationId);
        await this.repository.transition(record.operationId, "reconciliation-required");
      }
    }
  }

  public async status(operationId: string): Promise<IngestOperationStatusV1 | undefined> {
    return this.repository.status(operationId);
  }

  private stagedPath(operationId: string): string { return join(this.root, "staging", operationId, "source"); }
  private finalPath(record: AuthoritativeIngestRecord): string { return join(this.root, record.relativePath); }
}

/** Deterministic test double that models registered-only catalog visibility. */
export class InMemoryAuthoritativeIngestRepository implements AuthoritativeIngestRepository {
  private readonly records = new Map<string, AuthoritativeIngestRecord>();
  private readonly byFingerprint = new Map<string, string>();
  private readonly byIdempotency = new Map<string, string>();
  private readonly visible = new Set<string>();

  public async claim(record: AuthoritativeIngestRecord): Promise<AuthoritativeIngestRecord> {
    const idempotency = `${record.subject}\u0000${record.idempotencyKey}`;
    const replayId = this.byIdempotency.get(idempotency);
    if (replayId) return this.records.get(replayId)!;
    const duplicateId = this.byFingerprint.get(record.contentFingerprint);
    if (duplicateId) return this.records.get(duplicateId)!;
    this.records.set(record.operationId, record);
    this.byFingerprint.set(record.contentFingerprint, record.operationId);
    this.byIdempotency.set(idempotency, record.operationId);
    return record;
  }

  public async transition(operationId: string, state: AuthoritativeIngestState): Promise<void> {
    const record = this.records.get(operationId);
    if (!record) throw new Error("Ingest operation does not exist.");
    this.records.set(operationId, { ...record, state });
  }

  public async register(record: AuthoritativeIngestRecord): Promise<void> { this.visible.add(record.operationId); }
  public async hide(operationId: string): Promise<void> { this.visible.delete(operationId); }
  public async status(operationId: string): Promise<IngestOperationStatusV1 | undefined> { const record = this.records.get(operationId); return record ? { operationId, state: record.state, ...(record.state === "registered" ? { outcome: "registered" as const } : {}) } : undefined; }
  public async incomplete(): Promise<readonly AuthoritativeIngestRecord[]> {
    // Reconciliation also verifies previously registered rows: a catalog entry
    // whose final byte disappeared must be hidden, never served optimistically.
    return [...this.records.values()].filter((record) => record.state !== "rejected");
  }
  public async browse(): Promise<MasterCatalogPage> { return { protocolVersion: "v1", items: [...this.visible].map((id) => this.records.get(id)!).filter((record) => record.state === "registered").map((record) => ({ publicationId: record.publicationId as never, knowledgeObjectId: record.knowledgeObjectId as never, title: record.metadata.title, authors: record.metadata.authors, versionId: record.versionId as never, availability: { kind: "master-library" } as never })) }; }
  /** Test-only inspection hook; callers receive durable metadata but no source bytes. */
  public async record(operationId: string): Promise<AuthoritativeIngestRecord | undefined> { return this.records.get(operationId); }
}

function createIds() { const suffix = randomUUID(); return { operationId: `operation:${suffix}`, publicationId: `publication:${suffix}`, versionId: `version:${suffix}`, knowledgeObjectId: `knowledge-object:${suffix}`, sourceItemId: `source-item:${suffix}` }; }
function accepted(record: AuthoritativeIngestRecord, outcome: "registered" | "duplicate"): IngestAcceptedV1 { return { operationId: record.operationId, publicationId: record.publicationId as never, versionId: record.versionId as never, knowledgeObjectId: record.knowledgeObjectId as never, outcome }; }
async function exists(path: string): Promise<boolean> { try { await access(path); return true; } catch { return false; } }
async function fingerprintMatches(path: string, fingerprint: string): Promise<boolean> { return `sha256:${createHash("sha256").update(await readFile(path)).digest("hex")}` === fingerprint; }

async function validateAndStageIngestSource(source: AsyncIterable<Uint8Array>, path: string, metadata: IngestSourceMetadataV1, policy: IngestValidationPolicy): Promise<ValidatedIngestSource> {
  validateMetadata(metadata);
  if (!Number.isSafeInteger(policy.maxBytes) || policy.maxBytes < 1) throw new IngestValidationError("Ingest policy has an invalid byte limit.");
  let byteLength = 0;
  const evidence: number[] = [];
  const hash = createHash("sha256");
  for await (const chunk of source) {
    byteLength += chunk.byteLength;
    if (byteLength > policy.maxBytes) throw new IngestCapacityError();
    if (evidence.length < 4096) evidence.push(...chunk.subarray(0, 4096 - evidence.length));
    hash.update(chunk);
    await appendFile(path, chunk);
  }
  if (byteLength !== metadata.byteLength) throw new IngestValidationError("Declared byte length does not match source bytes.");
  const bytes = new Uint8Array(evidence);
  if (!hasExpectedSignature(bytes, metadata.declaredMediaType)) throw new IngestValidationError("Declared media type does not match source signature.");
  return { mediaType: metadata.declaredMediaType, byteLength, contentFingerprint: `sha256:${hash.digest("hex")}` };
}

/**
 * Validates bounded local ingest bytes before any staging or authoritative write.
 * Original filename remains provenance only and is rejected if it resembles a path.
 */
export function validateIngestSource(
  bytes: Uint8Array,
  metadata: IngestSourceMetadataV1,
  policy: IngestValidationPolicy,
): ValidatedIngestSource {
  validateMetadata(metadata);
  if (!Number.isSafeInteger(policy.maxBytes) || policy.maxBytes < 1) {
    throw new IngestValidationError("Ingest policy has an invalid byte limit.");
  }
  if (bytes.byteLength !== metadata.byteLength) {
    throw new IngestValidationError("Declared byte length does not match source bytes.");
  }
  if (bytes.byteLength > policy.maxBytes) {
    throw new IngestCapacityError();
  }
  if (!hasExpectedSignature(bytes, metadata.declaredMediaType)) {
    throw new IngestValidationError("Declared media type does not match source signature.");
  }
  return {
    mediaType: metadata.declaredMediaType,
    byteLength: bytes.byteLength,
    contentFingerprint: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
  };
}

/** In-memory boundary model for unit tests; persistence is provided by the PostgreSQL journal. */
export class InMemoryIngestValidator {
  private readonly receipts = new Map<string, { readonly requestFingerprint: string; readonly result: IngestValidationResult }>();
  private readonly fingerprints = new Set<string>();
  private readonly duplicates: DuplicateIngestEvidence[] = [];

  public constructor(private readonly policy: IngestValidationPolicy) {}

  public accept(request: IngestValidationRequest): IngestValidationResult {
    const requestFingerprint = fingerprintRequest(request);
    const receiptKey = `${request.subject}\u0000${request.idempotencyKey}`;
    const receipt = this.receipts.get(receiptKey);
    if (receipt) {
      if (receipt.requestFingerprint !== requestFingerprint) throw new IngestIdempotencyConflictError();
      return receipt.result;
    }
    const validated = validateIngestSource(request.bytes, request.metadata, this.policy);
    if (this.fingerprints.has(validated.contentFingerprint)) {
      this.duplicates.push({ subject: request.subject, idempotencyKey: request.idempotencyKey, contentFingerprint: validated.contentFingerprint });
      throw new IngestDuplicateContentError();
    }
    const result: IngestValidationResult = { ...validated, outcome: "registered" };
    this.receipts.set(receiptKey, { requestFingerprint, result });
    this.fingerprints.add(validated.contentFingerprint);
    return result;
  }

  public duplicateEvidence(): readonly DuplicateIngestEvidence[] {
    return this.duplicates;
  }
}

function validateMetadata(metadata: IngestSourceMetadataV1): void {
  if (!metadata.title.trim() || metadata.authors.length === 0 || metadata.authors.some((author) => !author.trim())) {
    throw new IngestValidationError("Title and at least one author are required.");
  }
  if (!metadata.originalFilename || metadata.originalFilename.includes("/") || metadata.originalFilename.includes("\\") || metadata.originalFilename.includes("\0") || metadata.originalFilename === "." || metadata.originalFilename === "..") {
    throw new IngestValidationError("Original filename must be a basename provenance value.");
  }
  if (!Number.isSafeInteger(metadata.byteLength) || metadata.byteLength < 1) {
    throw new IngestValidationError("Declared byte length is invalid.");
  }
  if (metadata.acceptedProvenance && !validAcceptedProvenance(metadata.acceptedProvenance)) {
    throw new IngestValidationError("Accepted metadata provenance is invalid.");
  }
}

function validAcceptedProvenance(value: NonNullable<IngestSourceMetadataV1["acceptedProvenance"]>): boolean {
  const evidence = new Set(["pdf-info", "pdf-xmp", "epub-opf", "first-page-text", "filename", "local-ocr", "user-entered"]);
  const confidence = new Set(["high", "medium", "low"]);
  const valid = (candidate: unknown): candidate is { evidence: string; confidence: string } => typeof candidate === "object" && candidate !== null && "evidence" in candidate && "confidence" in candidate && typeof candidate.evidence === "string" && evidence.has(candidate.evidence) && typeof candidate.confidence === "string" && confidence.has(candidate.confidence) && Object.keys(candidate).length === 2;
  return valid(value.title) && Array.isArray(value.authors) && value.authors.length > 0 && value.authors.every(valid);
}

function hasExpectedSignature(bytes: Uint8Array, mediaType: IngestSourceMetadataV1["declaredMediaType"]): boolean {
  if (mediaType === "application/pdf") {
    return bytes.byteLength >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
  }
  if (bytes.byteLength < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 0x03 || bytes[3] !== 0x04) return false;
  return containsAscii(bytes, "mimetypeapplication/epub+zip");
}

function containsAscii(bytes: Uint8Array, needle: string): boolean {
  const encoded = [...needle].map((character) => character.charCodeAt(0));
  for (let offset = 0; offset <= bytes.byteLength - encoded.length; offset += 1) {
    if (encoded.every((value, index) => bytes[offset + index] === value)) return true;
  }
  return false;
}

function fingerprintRequest(request: IngestValidationRequest): string {
  return `sha256:${createHash("sha256").update(JSON.stringify({
    idempotencyKey: request.idempotencyKey,
    metadata: request.metadata,
    contentFingerprint: `sha256:${createHash("sha256").update(request.bytes).digest("hex")}`,
  })).digest("hex")}`;
}

function fingerprintStreamRequest(request: Omit<IngestValidationRequest, "bytes">, contentFingerprint: string): string {
  return `sha256:${createHash("sha256").update(JSON.stringify({ idempotencyKey: request.idempotencyKey, metadata: request.metadata, contentFingerprint })).digest("hex")}`;
}
