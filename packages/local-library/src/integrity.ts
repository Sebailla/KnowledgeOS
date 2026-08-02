import type {
  LocalLibraryId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRepository,
  LocalContentStore,
} from "./repositories.js";

export interface LocalIntegrityIssue {
  readonly publicationId: string;
  readonly versionId: string;
  readonly code:
    | "missing-content"
    | "checksum-mismatch"
    | "length-mismatch"
    | "invalid-state";
}

export class LocalIntegrityService {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly content:
      LocalContentStore,
  ) {}

  async inspect(
    localLibraryId: LocalLibraryId,
  ): Promise<readonly LocalIntegrityIssue[]> {
    const issues: LocalIntegrityIssue[] = [];

    for (
      const record of await this.publications.list(
        localLibraryId,
      )
    ) {
      if (
        record.acquisitionStatus === "available" &&
        !record.readableOffline
      ) {
        issues.push({
          publicationId:
            record.publicationId,
          versionId:
            record.versionId,
          code: "invalid-state",
        });
        continue;
      }

      if (!record.readableOffline) continue;

      const valid = await this.content.verify(
        record.relativePath,
        record.contentFingerprint,
        record.byteLength,
      );

      if (!valid) {
        issues.push({
          publicationId:
            record.publicationId,
          versionId:
            record.versionId,
          code: "checksum-mismatch",
        });
      }
    }

    return issues;
  }
}
