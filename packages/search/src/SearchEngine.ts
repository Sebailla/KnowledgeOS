import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { SearchIndex } from "./contracts/SearchIndex.js";
import type { SearchProvider } from "./contracts/SearchProvider.js";
import type { SearchDocument } from "./model/SearchDocument.js";
import type { SearchResult } from "./model/SearchResult.js";
import { QueryParser } from "./query/QueryParser.js";

export class SearchEngine implements Engine {
  public readonly id = "search";
  public readonly name = "Search Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "storage",
  ] as const;

  private index: SearchIndex | undefined;
  private running = false;

  public constructor(
    private readonly provider: SearchProvider,
    private readonly parser = new QueryParser(),
    private readonly indexName = "knowledge",
  ) {}

  public async initialize(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();
    this.index =
      await this.provider.openIndex(this.indexName);
  }

  public async start(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();

    if (!this.index) {
      throw new Error(
        "Search Engine must be initialized before start.",
      );
    }

    this.running = true;
  }

  public async stop(
    _context: EngineContext,
  ): Promise<void> {
    this.running = false;
  }

  public async dispose(
    _context: EngineContext,
  ): Promise<void> {
    await this.provider.close();
    this.index = undefined;
    this.running = false;
  }

  public async indexDocument(
    document: SearchDocument,
  ): Promise<void> {
    await this.requireIndex().upsert(document);
  }

  public async removeDocument(
    documentId: string,
  ): Promise<boolean> {
    return this.requireIndex().remove(documentId);
  }

  public async search(
    input: string,
    options: {
      readonly offset?: number;
      readonly limit?: number;
    } = {},
  ): Promise<SearchResult> {
    if (!this.running) {
      throw new Error(
        "Search Engine is not running.",
      );
    }

    const query =
      this.parser.parse(input, options);

    return this.requireIndex().search(query);
  }

  private requireIndex(): SearchIndex {
    if (!this.index) {
      throw new Error(
        "Search index is unavailable.",
      );
    }

    return this.index;
  }
}
