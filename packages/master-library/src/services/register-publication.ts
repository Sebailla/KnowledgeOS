import type {
  ContentFingerprint,
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import {
  MasterLibraryError,
} from "../errors.js";
import type {
  MasterPublication,
  MasterPublicationVersion,
} from "../model.js";
import type {
  FingerprintIndex,
  MasterPublicationRepository,
  MasterPublicationVersionRepository,
} from "../repositories.js";

export interface RegisterMasterPublicationInput {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly sourceItemId: SourceItemId;
  readonly versionId: VersionId;
  readonly contentFingerprint: ContentFingerprint;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface RegisterMasterPublicationResult {
  readonly publication: MasterPublication;
  readonly version: MasterPublicationVersion;
  readonly duplicateOf?: {
    readonly publicationId: PublicationId;
    readonly versionId: VersionId;
  };
}

export class RegisterMasterPublicationService {
  public constructor(
    private readonly publications: MasterPublicationRepository,
    private readonly versions: MasterPublicationVersionRepository,
    private readonly fingerprints: FingerprintIndex,
  ) {}

  async execute(
    input: RegisterMasterPublicationInput,
  ): Promise<RegisterMasterPublicationResult> {
    if (!input.title.trim()) {
      throw new MasterLibraryError(
        "master-library.title-required",
        "Publication title is required",
      );
    }

    const duplicate =
      await this.fingerprints.findPublicationVersion(
        input.contentFingerprint,
      );

    if (duplicate) {
      return {
        publication: (
          await this.publications.getById(
            duplicate.publicationId,
          )
        )!,
        version: duplicate,
        duplicateOf: {
          publicationId: duplicate.publicationId,
          versionId: duplicate.versionId,
        },
      };
    }

    const publication: MasterPublication = {
      publicationId: input.publicationId,
      knowledgeObjectId: input.knowledgeObjectId,
      title: input.title,
      authors: [...input.authors],
      status: "available",
      currentVersionId: input.versionId,
      sourceItemIds: [input.sourceItemId],
      metadata: Object.freeze({
        ...(input.metadata ?? {}),
      }),
    };

    const version: MasterPublicationVersion = {
      versionId: input.versionId,
      publicationId: input.publicationId,
      sequence: 1,
      sourceItemId: input.sourceItemId,
      contentFingerprint: input.contentFingerprint,
      parentVersionIds: [],
    };

    await this.publications.save(publication);
    await this.versions.save(version);
    await this.fingerprints.indexPublicationVersion(version);

    return { publication, version };
  }
}
