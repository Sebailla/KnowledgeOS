import type { DocumentSnapshot } from "../model/DocumentSnapshot.js";
export interface DocumentSerializer {
  serialize(snapshot: DocumentSnapshot): string;
  deserialize(serialized: string): DocumentSnapshot;
}
export class JsonDocumentSerializer implements DocumentSerializer {
  public serialize(snapshot: DocumentSnapshot): string { return JSON.stringify(snapshot); }
  public deserialize(serialized: string): DocumentSnapshot { return JSON.parse(serialized) as DocumentSnapshot; }
}
