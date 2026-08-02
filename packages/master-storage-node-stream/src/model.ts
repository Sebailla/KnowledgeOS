import type {
  ContentFingerprint,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface DirectStoredObjectDescriptor {
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly contentFingerprint: ContentFingerprint;
  readonly mediaType: string;
  readonly byteLength: number;
  readonly absolutePath: string;
}

export interface DirectReadRange {
  readonly start: number;
  readonly endInclusive: number;
}

export interface DirectFileRead {
  readonly descriptor: DirectStoredObjectDescriptor;
  readonly range?: DirectReadRange;
  readonly contentLength: number;
  readonly stream: AsyncIterable<Uint8Array>;
}
