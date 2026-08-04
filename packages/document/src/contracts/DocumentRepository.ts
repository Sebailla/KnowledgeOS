import type { DocumentSnapshot } from "../model/DocumentSnapshot.js";
export interface DocumentRepository {
  get(id: string): Promise<DocumentSnapshot | undefined>;
  save(snapshot: DocumentSnapshot, expectedVersion?: number): Promise<void>;
  delete(id: string): Promise<boolean>;
  list(): Promise<readonly DocumentSnapshot[]>;
}
