import type { Document } from "../model/Document.js";
export interface DocumentSearchProjection {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
  readonly tags: readonly string[];
  readonly updatedAt: string;
}
export function documentToSearchProjection(document: Document): DocumentSearchProjection {
  return {
    id: document.id,
    title: document.revision.metadata.title,
    body: document.revision.content,
    metadata: { mimeType: document.revision.metadata.mimeType, revision: document.revision.revision },
    tags: document.revision.metadata.tags,
    updatedAt: document.updatedAt,
  };
}
