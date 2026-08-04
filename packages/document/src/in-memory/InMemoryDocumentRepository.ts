import { DocumentError } from "../errors/DocumentError.js";
import type { DocumentRepository } from "../contracts/DocumentRepository.js";
import type { DocumentSnapshot } from "../model/DocumentSnapshot.js";
export class InMemoryDocumentRepository implements DocumentRepository {
  private readonly snapshots = new Map<string, DocumentSnapshot>();
  public async get(id: string): Promise<DocumentSnapshot | undefined> { return this.snapshots.get(id); }
  public async save(snapshot: DocumentSnapshot, expectedVersion?: number): Promise<void> {
    const current = this.snapshots.get(snapshot.documentId);
    if (expectedVersion !== undefined && current?.version !== expectedVersion) {
      throw new DocumentError(`Expected version ${expectedVersion}, found ${current?.version ?? "none"}.`, "DOCUMENT_VERSION_CONFLICT");
    }
    this.snapshots.set(snapshot.documentId, snapshot);
  }
  public async delete(id: string): Promise<boolean> { return this.snapshots.delete(id); }
  public async list(): Promise<readonly DocumentSnapshot[]> { return [...this.snapshots.values()].sort((a,b)=>a.documentId.localeCompare(b.documentId)); }
}
