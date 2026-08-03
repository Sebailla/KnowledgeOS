import type {
  AnchorId,
  AnnotationId,
  KnowledgeObjectId,
  PersonalKnowledgeId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export type AnnotationKind =
  | "highlight"
  | "note"
  | "bookmark"
  | "comment"
  | "ink"
  | "sticky-note";

export interface CreateAnnotationPayload {
  readonly annotationId: AnnotationId;
  readonly personalKnowledgeId: PersonalKnowledgeId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly anchorId: AnchorId;
  readonly kind: AnnotationKind;
  readonly body?: string;
  readonly tags?: readonly string[];
}

export type CreateAnnotationCommand = Command<
  "annotation.create",
  CreateAnnotationPayload
>;

export interface ListAnnotationsParameters {
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly kinds?: readonly AnnotationKind[];
}

export type ListAnnotationsQuery = Query<
  "annotation.list",
  ListAnnotationsParameters
>;
