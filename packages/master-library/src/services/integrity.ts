import type {
  ContentFingerprint,
  PublicationId,
} from "@knowledgeos/domain-types";
import type {
  MasterAsset,
  MasterPublicationVersion,
} from "../model.js";
import { MasterLibraryError } from "../errors.js";

export interface IntegrityReport {
  readonly publicationId: PublicationId;
  readonly valid: boolean;
  readonly issues: readonly string[];
}

export class IntegrityService {
  validate(
    version: MasterPublicationVersion,
    assets: readonly MasterAsset[],
  ): IntegrityReport {
    const issues: string[] = [];

    if (version.sequence < 1) {
      issues.push("Version sequence must be positive");
    }

    if (!version.contentFingerprint) {
      issues.push("Publication version fingerprint is required");
    }

    for (const asset of assets) {
      if (asset.byteLength < 0) {
        issues.push(`Asset ${asset.assetId} has invalid byte length`);
      }
      if (!asset.contentFingerprint) {
        issues.push(`Asset ${asset.assetId} has no fingerprint`);
      }
    }

    return {
      publicationId: version.publicationId,
      valid: issues.length === 0,
      issues,
    };
  }

  assertValid(report: IntegrityReport): void {
    if (!report.valid) {
      throw new MasterLibraryError(
        "master-library.integrity-failed",
        report.issues.join("; "),
      );
    }
  }
}
