import type {
  LocalLibraryId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRecord,
} from "./model.js";

export interface LocalPublicationRepository {
  get(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): Promise<LocalPublicationRecord | undefined>;

  getVersion(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<LocalPublicationRecord | undefined>;

  save(
    value: LocalPublicationRecord,
  ): Promise<void>;

  list(
    localLibraryId: LocalLibraryId,
  ): Promise<readonly LocalPublicationRecord[]>;

  delete(
    localLibraryId: LocalLibraryId,
    publicationId: PublicationId,
  ): Promise<void>;
}

export interface LocalContentStore {
  stage(
    data: Uint8Array,
  ): Promise<{
    readonly stagingId: string;
    readonly temporaryPath: string;
    readonly contentFingerprint: string;
    readonly byteLength: number;
  }>;

  commit(
    staged: {
      readonly stagingId: string;
      readonly temporaryPath: string;
      readonly contentFingerprint: string;
      readonly byteLength: number;
    },
  ): Promise<{
    readonly relativePath: string;
  }>;

  read(
    relativePath: string,
  ): Promise<Uint8Array>;

  delete(
    relativePath: string,
  ): Promise<void>;

  verify(
    relativePath: string,
    expectedFingerprint: string,
    expectedByteLength: number,
  ): Promise<boolean>;
}
