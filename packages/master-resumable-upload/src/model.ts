import type {
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export type UploadSessionStatus =
  | "open"
  | "assembling"
  | "completed"
  | "cancelled"
  | "failed";

export interface UploadSessionMetadata {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly sourceItemId: SourceItemId;
  readonly versionId: VersionId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly mediaType: string;
  readonly expectedByteLength: number;
  readonly expectedChunkCount: number;
}

export interface UploadChunkRecord {
  readonly index: number;
  readonly byteLength: number;
  readonly checksum: string;
  readonly path: string;
}

export interface UploadSession {
  readonly sessionId: string;
  readonly status: UploadSessionStatus;
  readonly metadata: UploadSessionMetadata;
  readonly chunks: readonly UploadChunkRecord[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedPublicationId?: PublicationId;
  readonly completedVersionId?: VersionId;
}

export interface UploadSessionProgress {
  readonly sessionId: string;
  readonly status: UploadSessionStatus;
  readonly receivedChunks: number;
  readonly expectedChunkCount: number;
  readonly receivedBytes: number;
  readonly expectedByteLength: number;
  readonly missingChunkIndexes: readonly number[];
}
