import type { DocumentLockManager } from "./contracts/DocumentLockManager.js";
import type { DocumentManager } from "./DocumentManager.js";
import type { DocumentMetadata } from "./model/DocumentMetadata.js";
import type { Document } from "./model/Document.js";

export class DocumentSession {
  private document: Document | undefined;
  public constructor(private readonly manager: DocumentManager, private readonly locks: DocumentLockManager, private readonly ownerId: string, private readonly now: () => string) {}
  public get current(): Document | undefined { return this.document; }
  public async open(id: string): Promise<Document> {
    await this.locks.acquire(id, this.ownerId, this.now());
    this.document = await this.manager.open(id);
    return this.document;
  }
  public async revise(content: string, metadata: DocumentMetadata): Promise<Document> {
    if (!this.document) throw new Error("Document session is not open.");
    this.document = await this.manager.revise(this.document.id, content, metadata, this.ownerId);
    return this.document;
  }
  public async close(): Promise<void> {
    if (this.document) await this.locks.release(this.document.id, this.ownerId);
    this.document = undefined;
  }
}
