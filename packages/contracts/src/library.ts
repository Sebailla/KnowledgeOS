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
