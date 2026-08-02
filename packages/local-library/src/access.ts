import type {
  LocalLibraryId,
  PublicationId,
} from "@knowledgeos/domain-types";
import type {
  LocalContentStore,
  LocalPublicationRepository,
} from "./repositories.js";
import {
  LocalLibraryError,
} from "./errors.js";

export class LocalPublicationAccessService {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly content:
      LocalContentStore,
    private readonly nowIso: () => string,
  ) {}

  async open(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): Promise<Uint8Array> {
    const record =
      await this.publications.get(
        localLibraryId,
        publicationId,
      );

    if (
      !record ||
      !record.readableOffline ||
      record.acquisitionStatus !== "available"
    ) {
      throw new LocalLibraryError(
        "local-library.not-available-offline",
        "Publication is not available offline",
      );
    }

    const valid = await this.content.verify(
      record.relativePath,
      record.contentFingerprint,
      record.byteLength,
    );

    if (!valid) {
      await this.publications.save({
        ...record,
        acquisitionStatus:
          "failed",
        readableOffline:
          false,
      });

      throw new LocalLibraryError(
        "local-library.integrity-failed",
        "Local publication failed integrity verification",
      );
    }

    const data = await this.content.read(
      record.relativePath,
    );

    await this.publications.save({
      ...record,
      lastAccessedAt:
        this.nowIso(),
    });

    return data;
  }
}
