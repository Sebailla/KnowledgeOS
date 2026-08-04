import { DocumentError } from "../errors/DocumentError.js";
import type { DocumentLockManager } from "../contracts/DocumentLockManager.js";
import type { DocumentLock } from "../model/DocumentLock.js";
export class InMemoryDocumentLockManager implements DocumentLockManager {
  private readonly locks = new Map<string, DocumentLock>();
  public async acquire(documentId: string, ownerId: string, acquiredAt: string, expiresAt?: string): Promise<DocumentLock> {
    const current = this.locks.get(documentId);
    if (current && current.ownerId !== ownerId) throw new DocumentError(`Document '${documentId}' is locked.`, "DOCUMENT_LOCKED");
    const lock: DocumentLock = { documentId, ownerId, acquiredAt, ...(expiresAt !== undefined ? { expiresAt } : {}) };
    this.locks.set(documentId, lock);
    return lock;
  }
  public async release(documentId: string, ownerId: string): Promise<boolean> {
    const current = this.locks.get(documentId);
    if (!current) return false;
    if (current.ownerId !== ownerId) throw new DocumentError("Lock owner mismatch.", "DOCUMENT_LOCK_OWNER_MISMATCH");
    return this.locks.delete(documentId);
  }
  public async get(documentId: string): Promise<DocumentLock | undefined> { return this.locks.get(documentId); }
}
