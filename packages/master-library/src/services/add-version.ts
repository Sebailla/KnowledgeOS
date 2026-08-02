import type {
  ContentFingerprint,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import { MasterLibraryError } from "../errors.js";
import type {
  MasterPublicationVersion,
} from "../model.js";
import type {
  FingerprintIndex,
  MasterPublicationRepository,
  MasterPublicationVersionRepository,
} from "../repositories.js";

export interface AddMasterPublicationVersionInput {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly contentFingerprint: ContentFingerprint;
  readonly parentVersionIds: readonly VersionId[];
  readonly label?: string;
}

export class AddMasterPublicationVersionService {
  public constructor(
    private readonly publications: MasterPublicationRepository,
    private readonly versions: MasterPublicationVersionRepository,
    private readonly fingerprints: FingerprintIndex,
  ) {}

  async execute(
    input: AddMasterPublicationVersionInput,
  ): Promise<MasterPublicationVersion> {
    const publication =
      await this.publications.getById(input.publicationId);

    if (!publication) {
      throw new MasterLibraryError(
        "master-library.publication-not-found",
        "Publication does not exist",
      );
    }

    const duplicate =
      await this.fingerprints.findPublicationVersion(
        input.contentFingerprint,
      );
    if (duplicate) {
      throw new MasterLibraryError(
        "master-library.duplicate-content",
        "Content fingerprint already exists",
      );
    }

    const existing =
      await this.versions.listByPublication(
        input.publicationId,
      );
    const version: MasterPublicationVersion = {
      versionId: input.versionId,
      publicationId: input.publicationId,
      sequence: existing.length + 1,
      sourceItemId: input.sourceItemId,
      contentFingerprint: input.contentFingerprint,
      parentVersionIds: [...input.parentVersionIds],
      ...(input.label === undefined
        ? {}
        : { label: input.label }),
    };

    await this.versions.save(version);
    await this.fingerprints.indexPublicationVersion(version);
    await this.publications.save({
      ...publication,
      currentVersionId: version.versionId,
      sourceItemIds: [
        ...publication.sourceItemIds,
        version.sourceItemId,
      ],
    });

    return version;
  }
}
