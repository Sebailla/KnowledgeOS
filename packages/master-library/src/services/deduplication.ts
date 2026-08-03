import type {
  ContentFingerprint,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { FingerprintIndex } from "../repositories.js";

export type DeduplicationResult =
  | {
      readonly duplicate: false;
    }
  | {
      readonly duplicate: true;
      readonly publicationId: PublicationId;
      readonly versionId: VersionId;
    };

export class DeduplicationService {
  public constructor(
    private readonly fingerprints: FingerprintIndex,
  ) {}

  async inspect(
    fingerprint: ContentFingerprint,
  ): Promise<DeduplicationResult> {
    const existing =
      await this.fingerprints.findPublicationVersion(
        fingerprint,
      );

    return existing
      ? {
          duplicate: true,
          publicationId: existing.publicationId,
          versionId: existing.versionId,
        }
      : { duplicate: false };
  }
}
