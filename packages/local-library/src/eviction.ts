import type {
  LocalLibraryId,
  PublicationId,
} from "@knowledgeos/domain-types";
import type {
  LocalContentStore,
  LocalPublicationRepository,
} from "./repositories.js";
import type {
  LocalPublicationRecord,
} from "./model.js";
import {
  LocalLibraryError,
} from "./errors.js";

export class LocalEvictionService {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly content:
      LocalContentStore,
  ) {}

  async evict(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): Promise<LocalPublicationRecord> {
    const record =
      await this.publications.get(
        localLibraryId,
        publicationId,
      );

    if (!record) {
      throw new LocalLibraryError(
        "local-library.publication-not-found",
        "Local publication was not found",
      );
    }

    if (record.pinned) {
      throw new LocalLibraryError(
        "local-library.publication-pinned",
        "Pinned publication cannot be evicted",
      );
    }

    if (record.readableOffline) {
      await this.content.delete(
        record.relativePath,
      );
    }

    const updated: LocalPublicationRecord = {
      ...record,
      acquisitionStatus:
        "evicted",
      readableOffline:
        false,
      relativePath:
        "",
    };

    await this.publications.save(
      updated,
    );
    return updated;
  }
}
