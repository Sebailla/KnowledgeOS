import type {
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  RegisterMasterPublicationService,
} from "@knowledgeos/master-library";
import type {
  MasterPublicationStorage,
  StoredPublicationObject,
} from "@knowledgeos/master-storage";
import type { UnitOfWork } from "@knowledgeos/kernel";

export interface RegisterMasterArtifactInput {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly sourceItemId: SourceItemId;
  readonly versionId: VersionId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly mediaType: string;
  readonly data: Uint8Array;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface RegisterMasterArtifactResult {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly storage: StoredPublicationObject;
  readonly duplicate: boolean;
}

export interface MasterRegistrationEventSink {
  append(
    event: {
      readonly type: string;
      readonly payload: Readonly<Record<string, unknown>>;
    },
  ): Promise<void>;
}

export class MasterRegistrationWorkflow {
  public constructor(
    private readonly storage: MasterPublicationStorage,
    private readonly registration: RegisterMasterPublicationService,
    private readonly unitOfWork: UnitOfWork,
    private readonly events: MasterRegistrationEventSink,
  ) {}

  async execute(
    input: RegisterMasterArtifactInput,
  ): Promise<RegisterMasterArtifactResult> {
    const staged = await this.storage.stage(
      input.data,
      input.mediaType,
    );

    try {
      return await this.unitOfWork.run(async () => {
        const library = await this.registration.execute({
          publicationId: input.publicationId,
          knowledgeObjectId: input.knowledgeObjectId,
          title: input.title,
          authors: [...input.authors],
          sourceItemId: input.sourceItemId,
          versionId: input.versionId,
          contentFingerprint: staged.contentFingerprint,
          ...(input.metadata === undefined
            ? {}
            : { metadata: input.metadata }),
        });

        const storage = await this.storage.commit({
          publicationId: library.publication.publicationId,
          versionId: library.version.versionId,
          sourceItemId: library.version.sourceItemId,
          staged,
        });

        await this.events.append({
          type: library.duplicateOf
            ? "master-library.duplicate-detected"
            : "master-library.publication-registered",
          payload: {
            publicationId: library.publication.publicationId,
            versionId: library.version.versionId,
            fingerprint: storage.contentFingerprint,
            relativePath: storage.relativePath,
          },
        });

        return {
          publicationId: library.publication.publicationId,
          versionId: library.version.versionId,
          storage,
          duplicate: library.duplicateOf !== undefined,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
