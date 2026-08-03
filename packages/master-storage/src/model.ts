import type {
  ContentFingerprint,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface StoredPublicationObject {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly contentFingerprint: ContentFingerprint;
  readonly byteLength: number;
  readonly relativePath: string;
  readonly mediaType: string;
}

export interface StagedPublicationObject {
  readonly stagingId: string;
  readonly temporaryPath: string;
  readonly contentFingerprint: ContentFingerprint;
  readonly byteLength: number;
  readonly mediaType: string;
}

export interface StorageCommitRequest {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly staged: StagedPublicationObject;
}

export interface OrphanedStorageObject {
  readonly relativePath: string;
  readonly byteLength: number;
}
