import type {
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  RegisterMasterPublicationInput,
  RegisterMasterPublicationResult,
  RegisterMasterPublicationService,
} from "@knowledgeos/master-library";
import type {
  StoredPublicationObject,
} from "./model.js";
import {
  MasterPublicationStorage,
} from "./storage.js";

export interface RegisterStoredPublicationInput {
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

export interface RegisterStoredPublicationResult {
  readonly library: RegisterMasterPublicationResult;
  readonly storage: StoredPublicationObject;
}

export class RegisterStoredPublicationService {
  public constructor(
    private readonly storage: MasterPublicationStorage,
    private readonly registration: RegisterMasterPublicationService,
  ) {}

  async execute(
    input: RegisterStoredPublicationInput,
  ): Promise<RegisterStoredPublicationResult> {
    const staged = await this.storage.stage(
      input.data,
      input.mediaType,
    );

    const registrationInput: RegisterMasterPublicationInput = {
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
    };

    const library = await this.registration.execute(
      registrationInput,
    );

    const storage = await this.storage.commit({
      publicationId: library.publication.publicationId,
      versionId: library.version.versionId,
      sourceItemId: library.version.sourceItemId,
      staged,
    });

    return { library, storage };
  }
}
