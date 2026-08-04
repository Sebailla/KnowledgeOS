import type { ImportSink } from "../contracts/ImportSink.js";
import type { ImportDocument } from "../model/ImportDocument.js";

export class InMemoryImportSink
implements ImportSink {
  private readonly documents =
    new Map<string, ImportDocument>();

  public async save(
    document: ImportDocument,
  ): Promise<void> {
    this.documents.set(document.id, document);
  }

  public get(
    id: string,
  ): ImportDocument | undefined {
    return this.documents.get(id);
  }

  public list(): readonly ImportDocument[] {
    return [...this.documents.values()];
  }
}
