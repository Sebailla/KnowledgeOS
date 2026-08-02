import type {
  ContentFingerprint,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export type LocalAcquisitionStatus =
  | "requested"
  | "transferring"
  | "verifying"
  | "available"
  | "failed"
  | "evicted";

export interface LocalPublicationRecord {
  readonly localLibraryId: LocalLibraryId;
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly title: string;
  readonly mediaType: string;
  readonly byteLength: number;
  readonly contentFingerprint: ContentFingerprint;
  readonly relativePath: string;
  readonly acquisitionStatus: LocalAcquisitionStatus;
  readonly readableOffline: boolean;
  readonly pinned: boolean;
  readonly lastAccessedAt?: string;
  readonly acquiredAt?: string;
}

export interface LocalLibraryManifestEntry {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly contentFingerprint: ContentFingerprint;
  readonly byteLength: number;
  readonly readableOffline: boolean;
}

export interface LocalLibraryManifest {
  readonly localLibraryId: LocalLibraryId;
  readonly generatedAt: string;
  readonly entries: readonly LocalLibraryManifestEntry[];
}

export interface LocalStorageCommit {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly contentFingerprint: ContentFingerprint;
  readonly byteLength: number;
  readonly relativePath: string;
}
