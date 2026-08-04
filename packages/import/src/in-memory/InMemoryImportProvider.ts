import type { ImportProvider } from "../contracts/ImportProvider.js";
import type { ImportSource } from "../model/ImportSource.js";

export class InMemoryImportProvider
implements ImportProvider {
  public readonly id = "in-memory";

  public async read(
    source: ImportSource,
  ): Promise<string> {
    return source.content;
  }

  public async close(): Promise<void> {}
}
