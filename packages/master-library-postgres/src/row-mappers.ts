import type {
  ContentFingerprint,
  KnowledgeObjectId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  MasterAsset,
  MasterPublication,
  MasterPublicationVersion,
  MasterSnapshot,
} from "@knowledgeos/master-library";
import type { SqlRow } from "@knowledgeos/infrastructure-postgres";

export function publicationFromRow(row: SqlRow): MasterPublication {
  return {
    publicationId: row.publication_id as PublicationId,
    knowledgeObjectId: row.knowledge_object_id as KnowledgeObjectId,
    title: String(row.title),
    authors: Array.isArray(row.authors)
      ? row.authors.map(String)
      : [],
    status: row.status as MasterPublication["status"],
    ...(row.current_version_id === null || row.current_version_id === undefined
      ? {}
      : { currentVersionId: row.current_version_id as VersionId }),
    sourceItemIds: Array.isArray(row.source_item_ids)
      ? row.source_item_ids as MasterPublication["sourceItemIds"]
      : [],
    metadata:
      typeof row.metadata === "object" && row.metadata !== null
        ? row.metadata as Readonly<Record<string, string>>
        : {},
  };
}

export function versionFromRow(row: SqlRow): MasterPublicationVersion {
  return {
    versionId: row.version_id as VersionId,
    publicationId: row.publication_id as PublicationId,
    sequence: Number(row.sequence),
    sourceItemId: row.source_item_id as MasterPublicationVersion["sourceItemId"],
    contentFingerprint:
      row.content_fingerprint as ContentFingerprint,
    parentVersionIds: Array.isArray(row.parent_version_ids)
      ? row.parent_version_ids as readonly VersionId[]
      : [],
    ...(row.label === null || row.label === undefined
      ? {}
      : { label: String(row.label) }),
  };
}

export function assetFromRow(row: SqlRow): MasterAsset {
  return {
    assetId: String(row.asset_id),
    publicationId: row.publication_id as PublicationId,
    mediaType: String(row.media_type),
    byteLength: Number(row.byte_length),
    contentFingerprint:
      row.content_fingerprint as ContentFingerprint,
    role: row.role as MasterAsset["role"],
  };
}

export function snapshotFromRow(row: SqlRow): MasterSnapshot {
  return {
    snapshotId: String(row.snapshot_id),
    publicationId: row.publication_id as PublicationId,
    publicationVersionId:
      row.publication_version_id as VersionId,
    metadataFingerprint:
      row.metadata_fingerprint as ContentFingerprint,
    assetFingerprints: Array.isArray(row.asset_fingerprints)
      ? row.asset_fingerprints as readonly ContentFingerprint[]
      : [],
  };
}
