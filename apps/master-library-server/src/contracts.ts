import type {
  KnowledgeObjectId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface RegisterMasterPublicationBody {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly sourceItemId: SourceItemId;
  readonly versionId: VersionId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly mediaType: string;
  readonly contentBase64: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface AddMasterPublicationVersionBody {
  readonly versionId: VersionId;
  readonly sourceItemId: SourceItemId;
  readonly mediaType: string;
  readonly contentBase64: string;
  readonly parentVersionIds: readonly VersionId[];
  readonly label?: string;
}
