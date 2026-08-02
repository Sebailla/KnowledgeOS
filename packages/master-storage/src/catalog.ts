import type {
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { StoredPublicationObject } from "./model.js";

export interface MasterStorageCatalog {
  save(value: StoredPublicationObject): Promise<void>;
  getByVersion(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<StoredPublicationObject | undefined>;
  getBySourceItem(
    sourceItemId: SourceItemId,
  ): Promise<StoredPublicationObject | undefined>;
  listAll(): Promise<readonly StoredPublicationObject[]>;
  deleteByVersion(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<void>;
}

export class InMemoryMasterStorageCatalog
implements MasterStorageCatalog {
  private readonly values = new Map<string, StoredPublicationObject>();

  private key(
    publicationId: PublicationId,
    versionId: VersionId,
  ): string {
    return `${publicationId}::${versionId}`;
  }

  async save(value: StoredPublicationObject): Promise<void> {
    this.values.set(
      this.key(value.publicationId, value.versionId),
      value,
    );
  }

  async getByVersion(
    publicationId: PublicationId,
    versionId: VersionId,
  ) {
    return this.values.get(this.key(publicationId, versionId));
  }

  async getBySourceItem(sourceItemId: SourceItemId) {
    return [...this.values.values()].find(
      (value) => value.sourceItemId === sourceItemId,
    );
  }

  async listAll() {
    return [...this.values.values()];
  }

  async deleteByVersion(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<void> {
    this.values.delete(this.key(publicationId, versionId));
  }
}
