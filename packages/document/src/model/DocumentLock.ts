export interface DocumentLock {
  readonly documentId: string;
  readonly ownerId: string;
  readonly acquiredAt: string;
  readonly expiresAt?: string;
}
