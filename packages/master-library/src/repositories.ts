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
} from "./model.js";

export interface MasterPublicationRepository {
  getById(id: PublicationId): Promise<MasterPublication | undefined>;
  getByKnowledgeObjectId(
    id: KnowledgeObjectId,
  ): Promise<MasterPublication | undefined>;
  save(value: MasterPublication): Promise<void>;
}

export interface MasterPublicationVersionRepository {
  get(id: VersionId): Promise<MasterPublicationVersion | undefined>;
  listByPublication(
    id: PublicationId,
  ): Promise<readonly MasterPublicationVersion[]>;
  save(value: MasterPublicationVersion): Promise<void>;
}

export interface MasterAssetRepository {
  listByPublication(id: PublicationId): Promise<readonly MasterAsset[]>;
  save(value: MasterAsset): Promise<void>;
}

export interface MasterSnapshotRepository {
  get(id: string): Promise<MasterSnapshot | undefined>;
  save(value: MasterSnapshot): Promise<void>;
}

export interface FingerprintIndex {
  findPublicationVersion(
    fingerprint: ContentFingerprint,
  ): Promise<MasterPublicationVersion | undefined>;
  indexPublicationVersion(
    value: MasterPublicationVersion,
  ): Promise<void>;
}
