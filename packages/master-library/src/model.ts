import type {
  ContentFingerprint,
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export type MasterPublicationStatus =
  | "registered"
  | "processing"
  | "available"
  | "withdrawn"
  | "corrupt";

export interface MasterPublication {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly status: MasterPublicationStatus;
  readonly currentVersionId?: VersionId;
  readonly sourceItemIds: readonly SourceItemId[];
  readonly metadata: Readonly<Record<string, string>>;
}

export interface MasterPublicationVersion {
  readonly versionId: VersionId;
  readonly publicationId: PublicationId;
  readonly sequence: number;
  readonly sourceItemId: SourceItemId;
  readonly contentFingerprint: ContentFingerprint;
  readonly parentVersionIds: readonly VersionId[];
  readonly label?: string;
}

export interface MasterAsset {
  readonly assetId: string;
  readonly publicationId: PublicationId;
  readonly mediaType: string;
  readonly byteLength: number;
  readonly contentFingerprint: ContentFingerprint;
  readonly role:
    | "cover"
    | "figure"
    | "attachment"
    | "supplement"
    | "thumbnail";
}

export interface MasterSnapshot {
  readonly snapshotId: string;
  readonly publicationId: PublicationId;
  readonly publicationVersionId: VersionId;
  readonly metadataFingerprint: ContentFingerprint;
  readonly assetFingerprints: readonly ContentFingerprint[];
}
