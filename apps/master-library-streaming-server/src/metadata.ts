import type {
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface UploadMetadata {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly sourceItemId: SourceItemId;
  readonly versionId: VersionId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly mediaType: string;
}

function requiredHeader(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string {
  const value = headers[name];
  if (!value?.trim()) {
    throw new Error(`${name} header is required`);
  }
  return value;
}

export function parseUploadMetadata(
  headers: Readonly<Record<string, string | undefined>>,
): UploadMetadata {
  const authorsHeader = headers["x-knowledgeos-authors"];

  return {
    publicationId: requiredHeader(
      headers,
      "x-knowledgeos-publication-id",
    ) as PublicationId,
    knowledgeObjectId: requiredHeader(
      headers,
      "x-knowledgeos-knowledge-object-id",
    ) as KnowledgeObjectId,
    sourceItemId: requiredHeader(
      headers,
      "x-knowledgeos-source-item-id",
    ) as SourceItemId,
    versionId: requiredHeader(
      headers,
      "x-knowledgeos-version-id",
    ) as VersionId,
    title: requiredHeader(
      headers,
      "x-knowledgeos-title",
    ),
    authors: authorsHeader
      ? authorsHeader
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [],
    mediaType:
      headers["content-type"] ??
      "application/octet-stream",
  };
}
