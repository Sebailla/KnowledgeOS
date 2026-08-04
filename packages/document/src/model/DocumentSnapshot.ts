import type { DocumentRevision } from "./DocumentRevision.js";
export interface DocumentSnapshot {
  readonly documentId: string;
  readonly version: number;
  readonly currentRevision: number;
  readonly revisions: readonly DocumentRevision[];
  readonly deleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
