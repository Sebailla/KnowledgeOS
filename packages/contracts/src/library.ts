import type {
  AcquisitionId,
  AvailabilityDescriptor,
  KnowledgeObjectId,
  LocalLibraryId,
  Page,
  PageRequest,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export interface PublicationSummary {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly versionId: VersionId;
  readonly availability: AvailabilityDescriptor;
}

export const MASTER_LIBRARY_PROTOCOL_VERSION = "v1";

export type MasterLibraryProtocolVersion =
  typeof MASTER_LIBRARY_PROTOCOL_VERSION;

export interface MasterCatalogPage {
  readonly protocolVersion: MasterLibraryProtocolVersion;
  readonly items: readonly PublicationSummary[];
  readonly nextCursor?: string;
}

export interface AcquisitionManifest {
  readonly protocolVersion: MasterLibraryProtocolVersion;
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly versionId: VersionId;
  readonly contentFingerprint: string;
  readonly byteLength: number;
  readonly mediaType: string;
}

/** Versioned client handoff; Master Library never executes Local Library work. */
export interface InitiateAcquisitionV1 {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly targetLocalLibraryId: LocalLibraryId;
}

export interface AcquisitionReceiptV1 {
  readonly acquisitionId: AcquisitionId;
  readonly idempotencyKey: string;
  readonly accepted: true;
}

export interface AcquisitionHandoffAcceptedV1 {
  readonly receipt: AcquisitionReceiptV1;
  readonly manifest: AcquisitionManifest;
}

export type MasterLibraryErrorCode =
  | "authorization.denied"
  | "catalog.not-found"
  | "range.invalid"
  | "integrity.failed"
  | "operation.conflict"
  | "validation.failed"
  | "catalog.unavailable"
  | "compatibility.unsupported"
  | "infrastructure.transient"
  | "master-library.personal-knowledge-forbidden"
  | "http.route-not-found"
  | "ingest.validation-failed"
  | "ingest.capacity-exceeded"
  | "ingest.idempotency-conflict"
  | "ingest.duplicate-content"
  | "inspection.validation-failed"
  | "inspection.capacity-exceeded"
  | "inspection.cancelled"
  | "ocr.unavailable"
  | "ocr.limited"
  | "ocr.failed";

export interface MasterLibraryError {
  readonly code: MasterLibraryErrorCode;
  readonly correlationId: string;
}

/** Temporary compatibility mapping from the pre-v1 content path to its v1 replacement. */
export interface MasterLibraryContentAlias {
  readonly deprecatedPath: string;
  readonly canonicalPath: string;
  readonly sunsetAfter: string;
}

export interface BrowseMasterCatalogParameters extends PageRequest {
  readonly search?: string;
  readonly format?: string;
}

export type BrowseMasterCatalogQuery = Query<
  "library.browse-master-catalog",
  BrowseMasterCatalogParameters
>;

export type BrowseMasterCatalogResult = Page<PublicationSummary>;

export interface RequestAcquisitionPayload {
  readonly publicationId: PublicationId;
  readonly requestedVersionId?: VersionId;
  readonly targetLocalLibraryId: LocalLibraryId;
}

export type RequestAcquisitionCommand = Command<
  "library.request-acquisition",
  RequestAcquisitionPayload
>;

export interface AcquisitionAccepted {
  readonly acquisitionId: AcquisitionId;
}

export interface RegisterLocalSourcePayload {
  readonly localLibraryId: LocalLibraryId;
  readonly sourceItemId: SourceItemId;
  readonly contentFingerprint: string;
  readonly originalFilename?: string;
  readonly title?: string;
  readonly mediaType?: string;
  readonly byteLength?: number;
  readonly sourceVersionId?: VersionId;
}

export type RegisterLocalSourceCommand = Command<
  "library.register-local-source",
  RegisterLocalSourcePayload
>;


export interface GetLocalAvailabilityParameters {
  readonly localLibraryId: LocalLibraryId;
  readonly knowledgeObjectId: KnowledgeObjectId;
}

export type GetLocalAvailabilityQuery = Query<
  "library.get-local-availability",
  GetLocalAvailabilityParameters
>;

export interface LocalAvailabilityResult {
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly localLibraryId: LocalLibraryId;
  readonly availability: AvailabilityDescriptor;
  readonly sourceItemId?: SourceItemId;
  readonly sourceVersionId?: VersionId;
}

export interface ListLocalLibraryParameters extends PageRequest {
  readonly localLibraryId: LocalLibraryId;
}

export type ListLocalLibraryQuery = Query<
  "library.list-local-library",
  ListLocalLibraryParameters
>;

export type ListLocalLibraryResult = Page<PublicationSummary>;

/** Local-only request metadata for authoritative PDF/EPUB intake. Source bytes travel outside this DTO. */
export interface IngestSourceMetadataV1 {
  readonly title: string;
  readonly authors: readonly string[];
  readonly originalFilename: string;
  readonly declaredMediaType: "application/pdf" | "application/epub+zip";
  readonly byteLength: number;
  /** Review-confirmed source labels only; never extracted content, paths, or identities. */
  readonly acceptedProvenance?: AcceptedMetadataProvenanceV1;
}

/** Versioned ingest intent; paths and client-provided identities are deliberately absent. */
export interface IngestPublicationV1 {
  readonly idempotencyKey: string;
  readonly metadata: IngestSourceMetadataV1;
}

export type IngestOutcomeV1 = "registered" | "duplicate";

/** Accepted results contain server-assigned opaque identities only. */
export interface IngestAcceptedV1 {
  readonly operationId: string;
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly outcome: IngestOutcomeV1;
}

export type IngestOperationStateV1 =
  | "staged"
  | "validated"
  | "promoted"
  | "registered"
  | "reconciliation-required"
  | "rejected";

/** Status is intentionally redacted: no filesystem path, bytes, or credentials are exposed. */
export interface IngestOperationStatusV1 {
  readonly operationId: string;
  readonly state: IngestOperationStateV1;
  readonly outcome?: IngestOutcomeV1;
  readonly error?: MasterLibraryError;
}

/** Local evidence used to propose a value before explicit user submission. */
export type MetadataEvidence =
  | "pdf-info"
  | "pdf-xmp"
  | "epub-opf"
  | "first-page-text"
  | "filename"
  | "local-ocr"
  | "user-entered";

export type MetadataConfidence = "high" | "medium" | "low";

export interface MetadataSuggestion {
  readonly value: string;
  readonly evidence: MetadataEvidence;
  readonly confidence: MetadataConfidence;
}

/** A lower-ranked local suggestion that the reviewer may explicitly apply. */
export interface MetadataCandidate extends MetadataSuggestion {
  /** The metadata field to which this candidate may be applied. */
  readonly field: "title" | "authors";
}

/** Immutable evidence labels retained beside accepted title and author values. */
export interface AcceptedMetadataProvenanceV1 {
  readonly title: Pick<MetadataSuggestion, "evidence" | "confidence">;
  readonly authors: readonly Pick<MetadataSuggestion, "evidence" | "confidence">[];
}

/** Source bytes travel separately and are never persisted by inspection. */
export interface InspectPublicationV1 {
  readonly metadata: Pick<
    IngestSourceMetadataV1,
    "originalFilename" | "declaredMediaType" | "byteLength"
  >;
}

/** Reviewable, local-only suggestions; candidates preserve lower-ranked conflicts and their target field. */
export interface InspectPublicationResultV1 {
  readonly title?: MetadataSuggestion;
  readonly authors?: readonly MetadataSuggestion[];
  readonly candidates: readonly MetadataCandidate[];
  readonly correlationId: string;
  readonly outcome: "completed" | "partial" | "ocr-unavailable" | "ocr-limited";
}
