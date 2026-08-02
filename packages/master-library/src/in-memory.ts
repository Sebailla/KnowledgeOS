import type {
  ContentFingerprint,
  KnowledgeObjectId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  FingerprintIndex,
  MasterAssetRepository,
  MasterPublicationRepository,
  MasterPublicationVersionRepository,
  MasterSnapshotRepository,
} from "./repositories.js";
import type {
  MasterAsset,
  MasterPublication,
  MasterPublicationVersion,
  MasterSnapshot,
} from "./model.js";

export class InMemoryMasterPublicationRepository
implements MasterPublicationRepository {
  private readonly values = new Map<PublicationId, MasterPublication>();

  async getById(id: PublicationId) {
    return this.values.get(id);
  }

  async getByKnowledgeObjectId(id: KnowledgeObjectId) {
    return [...this.values.values()].find(
      (value) => value.knowledgeObjectId === id,
    );
  }

  async save(value: MasterPublication): Promise<void> {
    this.values.set(value.publicationId, value);
  }
}

export class InMemoryMasterPublicationVersionRepository
implements MasterPublicationVersionRepository, FingerprintIndex {
  private readonly values = new Map<VersionId, MasterPublicationVersion>();
  private readonly fingerprints =
    new Map<ContentFingerprint, VersionId>();

  async get(id: VersionId) {
    return this.values.get(id);
  }

  async listByPublication(id: PublicationId) {
    return [...this.values.values()]
      .filter((value) => value.publicationId === id)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async save(value: MasterPublicationVersion): Promise<void> {
    this.values.set(value.versionId, value);
  }

  async findPublicationVersion(
    fingerprint: ContentFingerprint,
  ) {
    const id = this.fingerprints.get(fingerprint);
    return id ? this.values.get(id) : undefined;
  }

  async indexPublicationVersion(
    value: MasterPublicationVersion,
  ): Promise<void> {
    this.fingerprints.set(
      value.contentFingerprint,
      value.versionId,
    );
  }
}

export class InMemoryMasterAssetRepository
implements MasterAssetRepository {
  private readonly values = new Map<string, MasterAsset>();

  async listByPublication(id: PublicationId) {
    return [...this.values.values()].filter(
      (value) => value.publicationId === id,
    );
  }

  async save(value: MasterAsset): Promise<void> {
    this.values.set(value.assetId, value);
  }
}

export class InMemoryMasterSnapshotRepository
implements MasterSnapshotRepository {
  private readonly values = new Map<string, MasterSnapshot>();

  async get(id: string) {
    return this.values.get(id);
  }

  async save(value: MasterSnapshot): Promise<void> {
    this.values.set(value.snapshotId, value);
  }
}
