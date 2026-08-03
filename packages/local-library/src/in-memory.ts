import type {
  LocalLibraryId,
  PublicationId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRecord,
} from "./model.js";
import type {
  LocalPublicationRepository,
} from "./repositories.js";

export class InMemoryLocalPublicationRepository
implements LocalPublicationRepository {
  private readonly values =
    new Map<string, LocalPublicationRecord>();

  private key(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): string {
    return `${localLibraryId}::${publicationId}`;
  }

  async get(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ) {
    return this.values.get(
      this.key(localLibraryId, publicationId),
    );
  }

  async getVersion(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
    versionId: LocalPublicationRecord["versionId"],
  ) {
    const value = await this.get(
      localLibraryId,
      publicationId,
    );
    return value?.versionId === versionId
      ? value
      : undefined;
  }

  async save(
    value: LocalPublicationRecord,
  ): Promise<void> {
    this.values.set(
      this.key(
        value.localLibraryId,
        value.publicationId,
      ),
      value,
    );
  }

  async list(
    localLibraryId: LocalLibraryId,
  ) {
    return [...this.values.values()]
      .filter(
        (value) =>
          value.localLibraryId === localLibraryId,
      )
      .sort((a, b) =>
        String(a.publicationId).localeCompare(
          String(b.publicationId),
        ),
      );
  }

  async delete(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): Promise<void> {
    this.values.delete(
      this.key(localLibraryId, publicationId),
    );
  }
}
