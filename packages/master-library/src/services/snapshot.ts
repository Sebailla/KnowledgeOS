import type {
  ContentFingerprint,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  MasterAsset,
  MasterPublication,
  MasterPublicationVersion,
  MasterSnapshot,
} from "../model.js";

export interface SnapshotHasher {
  hash(value: string): ContentFingerprint;
}

export class SnapshotService {
  public constructor(
    private readonly hasher: SnapshotHasher,
  ) {}

  create(
    snapshotId: string,
    publication: MasterPublication,
    version: MasterPublicationVersion,
    assets: readonly MasterAsset[],
  ): MasterSnapshot {
    return {
      snapshotId,
      publicationId: publication.publicationId,
      publicationVersionId: version.versionId,
      metadataFingerprint: this.hasher.hash(
        JSON.stringify(publication.metadata),
      ),
      assetFingerprints: assets
        .map((asset) => asset.contentFingerprint)
        .sort(),
    };
  }
}
