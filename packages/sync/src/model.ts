import type { ContentFingerprint, DeviceId, KnowledgeObjectId, LocalLibraryId, PublicationId, VersionId } from "@knowledgeos/domain-types";

export type SyncDirection = "master-to-local";
export type SyncEntryState = "missing" | "outdated" | "current" | "removed";
export type TransferState = "pending" | "transferring" | "verifying" | "completed" | "failed" | "cancelled";

export interface MasterManifestEntry {
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly fingerprint: ContentFingerprint;
  readonly byteLength: number;
  readonly mediaType: string;
}
export interface MasterManifest {
  readonly manifestId: string;
  readonly revision: number;
  readonly generatedAt: string;
  readonly entries: readonly MasterManifestEntry[];
  readonly fingerprint: ContentFingerprint;
}
export interface LocalManifestEntry extends MasterManifestEntry { readonly availableOffline: boolean; }
export interface LocalManifest {
  readonly localLibraryId: LocalLibraryId;
  readonly deviceId: DeviceId;
  readonly revision: number;
  readonly entries: readonly LocalManifestEntry[];
}
export interface SyncDifference { readonly state: SyncEntryState; readonly master: MasterManifestEntry; readonly local?: LocalManifestEntry; }
export interface TransferCheckpoint { readonly transferId: string; readonly publicationId: PublicationId; readonly versionId: VersionId; readonly expectedFingerprint: ContentFingerprint; readonly expectedByteLength: number; readonly receivedBytes: number; readonly state: TransferState; readonly updatedAt: string; }
export interface SyncPlan { readonly planId: string; readonly direction: SyncDirection; readonly masterRevision: number; readonly localRevision: number; readonly transfers: readonly TransferCheckpoint[]; readonly unchanged: number; }
