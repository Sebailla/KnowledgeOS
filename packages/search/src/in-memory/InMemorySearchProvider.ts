import type { SearchIndex } from "../contracts/SearchIndex.js";
import type { SearchProvider } from "../contracts/SearchProvider.js";
import { InMemorySearchIndex } from "./InMemorySearchIndex.js";

export class InMemorySearchProvider
implements SearchProvider {
  public readonly id = "in-memory";

  private readonly indexes =
    new Map<string, InMemorySearchIndex>();

  private closed = false;

  public async openIndex(
    name: string,
  ): Promise<SearchIndex> {
    if (this.closed) {
      throw new Error(
        "Search provider is closed.",
      );
    }

    const existing = this.indexes.get(name);

    if (existing) {
      return existing;
    }

    const created = new InMemorySearchIndex();
    this.indexes.set(name, created);

    return created;
  }

  public async close(): Promise<void> {
    this.closed = true;
    this.indexes.clear();
  }
}
