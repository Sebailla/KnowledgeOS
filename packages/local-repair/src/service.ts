import type {
  LocalLibraryId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRepository,
  LocalContentStore,
} from "@knowledgeos/local-library";
import type {
  ScannedLocalObject,
} from "@knowledgeos/local-storage";
import type {
  LocalRepairIssue,
  LocalRepairReport,
} from "./model.js";

export interface LocalObjectScanner {
  scan(): Promise<
    readonly ScannedLocalObject[]
  >;
}

export class LocalRepairService {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly content:
      LocalContentStore,
    private readonly scanner:
      LocalObjectScanner,
  ) {}

  async inspect(
    localLibraryId: LocalLibraryId,
  ): Promise<LocalRepairReport> {
    const issues: LocalRepairIssue[] = [];
    const records =
      await this.publications.list(
        localLibraryId,
      );
    const objects =
      await this.scanner.scan();

    const referenced =
      new Set(
        records
          .filter(
            (record) =>
              record.relativePath,
          )
          .map(
            (record) =>
              record.relativePath,
          ),
      );

    for (const record of records) {
      if (
        record.readableOffline &&
        !record.relativePath
      ) {
        issues.push({
          code:
            "invalid-offline-state",
          publicationId:
            record.publicationId,
        });
        continue;
      }

      if (!record.relativePath) continue;

      const valid =
        await this.content.verify(
          record.relativePath,
          record.contentFingerprint,
          record.byteLength,
        );

      if (!valid) {
        issues.push({
          code:
            "checksum-mismatch",
          publicationId:
            record.publicationId,
          relativePath:
            record.relativePath,
        });
      }
    }

    for (const object of objects) {
      if (
        !referenced.has(
          object.relativePath,
        )
      ) {
        issues.push({
          code:
            "object-missing-catalog",
          relativePath:
            object.relativePath,
        });
      }
    }

    return {
      issues,
      repaired: [],
    };
  }

  async markInvalidRecords(
    localLibraryId: LocalLibraryId,
  ): Promise<LocalRepairReport> {
    const report =
      await this.inspect(
        localLibraryId,
      );
    const repaired: LocalRepairIssue[] = [];

    for (const issue of report.issues) {
      if (!issue.publicationId) continue;

      const record =
        await this.publications.get(
          localLibraryId,
          issue.publicationId as never,
        );
      if (!record) continue;

      await this.publications.save({
        ...record,
        acquisitionStatus:
          "failed",
        readableOffline:
          false,
      });
      repaired.push(issue);
    }

    return {
      issues:
        report.issues,
      repaired,
    };
  }
}
