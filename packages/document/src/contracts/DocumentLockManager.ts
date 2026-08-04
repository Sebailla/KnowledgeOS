import type { DocumentLock } from "../model/DocumentLock.js";
export interface DocumentLockManager {
  acquire(documentId: string, ownerId: string, acquiredAt: string, expiresAt?: string): Promise<DocumentLock>;
  release(documentId: string, ownerId: string): Promise<boolean>;
  get(documentId: string): Promise<DocumentLock | undefined>;
}
