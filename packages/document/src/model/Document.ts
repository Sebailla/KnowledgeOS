import { DocumentError } from "../errors/DocumentError.js";
import type { DocumentMetadata } from "./DocumentMetadata.js";
import type { DocumentRevision } from "./DocumentRevision.js";
import type { DocumentSnapshot } from "./DocumentSnapshot.js";

export class Document {
  private readonly revisions: DocumentRevision[];
  private currentRevision: number;
  private currentVersion: number;
  private deletedState: boolean;
  private updatedTimestamp: string;

  private constructor(
    public readonly id: string,
    revisions: readonly DocumentRevision[],
    currentRevision: number,
    version: number,
    deleted: boolean,
    public readonly createdAt: string,
    updatedAt: string,
  ) {
    this.revisions = [...revisions];
    this.currentRevision = currentRevision;
    this.currentVersion = version;
    this.deletedState = deleted;
    this.updatedTimestamp = updatedAt;
  }

  public static create(
    id: string,
    content: string,
    metadata: DocumentMetadata,
    now: string,
    checksum: string,
    authorId?: string,
  ): Document {
    if (id.trim().length === 0) throw new DocumentError("Document id cannot be empty.", "DOCUMENT_ID_INVALID");
    const revision: DocumentRevision = {
      revision: 1,
      content,
      metadata,
      createdAt: now,
      checksum,
      ...(authorId !== undefined ? { authorId } : {}),
    };
    return new Document(id, [revision], 1, 1, false, now, now);
  }

  public static rehydrate(snapshot: DocumentSnapshot): Document {
    return new Document(
      snapshot.documentId,
      snapshot.revisions,
      snapshot.currentRevision,
      snapshot.version,
      snapshot.deleted,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  public get version(): number { return this.currentVersion; }
  public get deleted(): boolean { return this.deletedState; }
  public get updatedAt(): string { return this.updatedTimestamp; }
  public get revision(): DocumentRevision {
    const value = this.revisions.find((item) => item.revision === this.currentRevision);
    if (!value) throw new DocumentError("Current revision is unavailable.", "DOCUMENT_REVISION_MISSING");
    return value;
  }
  public get history(): readonly DocumentRevision[] { return [...this.revisions]; }

  public revise(content: string, metadata: DocumentMetadata, now: string, checksum: string, authorId?: string): DocumentRevision {
    if (this.deletedState) throw new DocumentError("Deleted document cannot be revised.", "DOCUMENT_DELETED");
    const revision: DocumentRevision = {
      revision: this.revisions.length + 1,
      content,
      metadata,
      createdAt: now,
      checksum,
      ...(authorId !== undefined ? { authorId } : {}),
    };
    this.revisions.push(revision);
    this.currentRevision = revision.revision;
    this.currentVersion += 1;
    this.updatedTimestamp = now;
    return revision;
  }

  public restore(revisionNumber: number, now: string): void {
    if (!this.revisions.some((item) => item.revision === revisionNumber)) {
      throw new DocumentError(`Revision '${revisionNumber}' does not exist.`, "DOCUMENT_REVISION_NOT_FOUND");
    }
    this.currentRevision = revisionNumber;
    this.currentVersion += 1;
    this.updatedTimestamp = now;
  }

  public markDeleted(now: string): void {
    this.deletedState = true;
    this.currentVersion += 1;
    this.updatedTimestamp = now;
  }

  public snapshot(): DocumentSnapshot {
    return {
      documentId: this.id,
      version: this.currentVersion,
      currentRevision: this.currentRevision,
      revisions: [...this.revisions],
      deleted: this.deletedState,
      createdAt: this.createdAt,
      updatedAt: this.updatedTimestamp,
    };
  }
}
