import type {
  KnowledgeObjectId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";

export type SearchDocumentKind =
  | "publication"
  | "metadata"
  | "personal-knowledge"
  | "ocr"
  | "asset";

export interface SearchDocument {
  readonly searchDocumentId: string;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly publicationId?: PublicationId;
  readonly versionId?: VersionId;
  readonly kind: SearchDocumentKind;
  readonly title: string;
  readonly body: string;
  readonly language?: string;
  readonly tags: readonly string[];
  readonly authors: readonly string[];
  readonly source?: string;
  readonly createdAt?: string;
  readonly updatedAt: string;
  readonly deleted: boolean;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface SearchIndexCommand {
  readonly operation:
    | "upsert"
    | "delete";
  readonly document:
    SearchDocument;
  readonly sequence: number;
  readonly occurredAt: string;
}

export interface SearchIndexCheckpoint {
  readonly consumerId: string;
  readonly lastSequence: number;
  readonly updatedAt: string;
}
