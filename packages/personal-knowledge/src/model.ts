import type {
  KnowledgeObjectId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";

export type PersonalKnowledgeItemType =
  | "annotation"
  | "highlight"
  | "note"
  | "bookmark";

export interface TextAnchor {
  readonly kind: "text";
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly selectedText?: string;
}

export interface PageAnchor {
  readonly kind: "page";
  readonly publicationId: PublicationId;
  readonly versionId: VersionId;
  readonly pageNumber: number;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export type PersonalKnowledgeAnchor =
  | TextAnchor
  | PageAnchor;

export interface PersonalKnowledgeItem {
  readonly itemId: string;
  readonly ownerId: string;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly type: PersonalKnowledgeItemType;
  readonly anchor?: PersonalKnowledgeAnchor;
  readonly body: string;
  readonly tags: readonly string[];
  readonly color?: string;
  readonly revision: number;
  readonly deleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PersonalKnowledgeRevision {
  readonly itemId: string;
  readonly revision: number;
  readonly snapshot: PersonalKnowledgeItem;
  readonly changedAt: string;
  readonly changedBy: string;
}
