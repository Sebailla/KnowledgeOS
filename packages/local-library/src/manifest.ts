import type {
  LocalLibraryId,
} from "@knowledgeos/domain-types";
import type {
  LocalLibraryManifest,
} from "./model.js";
import type {
  LocalPublicationRepository,
} from "./repositories.js";

export class LocalManifestService {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly nowIso: () => string,
  ) {}

  async create(
    localLibraryId: LocalLibraryId,
  ): Promise<LocalLibraryManifest> {
    const records =
      await this.publications.list(
        localLibraryId,
      );

    return {
      localLibraryId,
      generatedAt: this.nowIso(),
      entries: records
        .map((record) => ({
          publicationId:
            record.publicationId,
          versionId:
            record.versionId,
          contentFingerprint:
            record.contentFingerprint,
          byteLength:
            record.byteLength,
          readableOffline:
            record.readableOffline,
        }))
        .sort((a, b) =>
          String(a.publicationId).localeCompare(
            String(b.publicationId),
          ),
        ),
    };
  }
}
