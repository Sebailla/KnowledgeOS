import type { DocumentMetadata } from "./DocumentMetadata.js";
export interface DocumentRevision {
  readonly revision: number;
  readonly content: string;
  readonly metadata: DocumentMetadata;
  readonly createdAt: string;
  readonly authorId?: string;
  readonly checksum: string;
}
