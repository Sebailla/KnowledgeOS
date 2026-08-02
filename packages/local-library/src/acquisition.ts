import type {
  ContentFingerprint,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRecord,
} from "./model.js";
import type {
  LocalContentStore,
  LocalPublicationRepository,
} from "./repositories.js";
import {
  LocalLibraryError,
} from "./errors.js";

export interface CommitLocalAcquisitionInput {
  readonly localLibraryId: LocalLibraryId;
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly title: string;
  readonly mediaType: string;
  readonly data: Uint8Array;
  readonly expectedFingerprint: ContentFingerprint;
  readonly expectedByteLength: number;
  readonly pinned?: boolean;
}

export class CommitLocalAcquisitionService {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly content:
      LocalContentStore,
    private readonly nowIso: () => string,
  ) {}

  async execute(
    input: CommitLocalAcquisitionInput,
  ): Promise<LocalPublicationRecord> {
    if (
      input.data.byteLength !==
      input.expectedByteLength
    ) {
      throw new LocalLibraryError(
        "local-library.length-mismatch",
        "Transferred content length does not match expected length",
      );
    }

    const staged = await this.content.stage(
      input.data,
    );

    if (
      staged.contentFingerprint !==
      input.expectedFingerprint
    ) {
      throw new LocalLibraryError(
        "local-library.checksum-mismatch",
        "Transferred content checksum does not match expected fingerprint",
      );
    }

    const committed =
      await this.content.commit(staged);

    const now = this.nowIso();
    const record: LocalPublicationRecord = {
      localLibraryId:
        input.localLibraryId,
      publicationId:
        input.publicationId,
      knowledgeObjectId:
        input.knowledgeObjectId,
      versionId:
        input.versionId,
      sourceItemId:
        input.sourceItemId,
      title:
        input.title,
      mediaType:
        input.mediaType,
      byteLength:
        input.expectedByteLength,
      contentFingerprint:
        input.expectedFingerprint,
      relativePath:
        committed.relativePath,
      acquisitionStatus:
        "available",
      readableOffline:
        true,
      pinned:
        input.pinned ?? false,
      acquiredAt:
        now,
      lastAccessedAt:
        now,
    };

    try {
      await this.publications.save(
        record,
      );
      return record;
    } catch (error) {
      await this.content.delete(
        committed.relativePath,
      );
      throw error;
    }
  }
}
