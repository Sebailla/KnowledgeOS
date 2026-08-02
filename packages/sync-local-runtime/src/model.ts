import type {
  ContentFingerprint,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface MasterTransferDescriptor {
  readonly transferId: string;
  readonly planId: string;
  readonly localLibraryId: LocalLibraryId;
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly title: string;
  readonly mediaType: string;
  readonly byteLength: number;
  readonly contentFingerprint: ContentFingerprint;
}

export interface PersistedTransferState {
  readonly transferId: string;
  readonly planId: string;
  readonly receivedBytes: number;
  readonly totalBytes: number;
  readonly completed: boolean;
  readonly checksumVerified: boolean;
  readonly temporaryPath: string;
  readonly updatedAt: string;
}

export interface TransferExecutionResult {
  readonly transferId: string;
  readonly receivedBytes: number;
  readonly totalBytes: number;
  readonly completed: boolean;
  readonly checksumVerified: boolean;
}
