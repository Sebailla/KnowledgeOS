import type {
  SearchDocument,
  SearchIndexCheckpoint,
  SearchIndexCommand,
} from "@knowledgeos/search-domain";
import type {
  SearchCheckpointRepository,
  SearchCommandRepository,
  SearchDocumentRepository,
  SearchUnitOfWork,
} from "@knowledgeos/search-domain";

export class InMemorySearchDocumentRepository
implements SearchDocumentRepository {
  private readonly values =
    new Map<string, SearchDocument>();

  async get(
    searchDocumentId: string,
  ) {
    return this.values.get(
      searchDocumentId,
    );
  }

  async upsert(
    document: SearchDocument,
  ): Promise<void> {
    this.values.set(
      document.searchDocumentId,
      document,
    );
  }

  async delete(
    searchDocumentId: string,
  ): Promise<void> {
    this.values.delete(
      searchDocumentId,
    );
  }

  list() {
    return [...this.values.values()];
  }
}

export class InMemorySearchCommandRepository
implements SearchCommandRepository {
  private readonly values:
    SearchIndexCommand[] = [];

  async append(
    commands:
      readonly SearchIndexCommand[],
  ): Promise<void> {
    this.values.push(
      ...commands,
    );
    this.values.sort(
      (a, b) =>
        a.sequence -
        b.sequence,
    );
  }

  async listAfter(
    sequence: number,
    limit: number,
  ) {
    return this.values
      .filter(
        (value) =>
          value.sequence >
          sequence,
      )
      .slice(0, limit);
  }
}

export class InMemorySearchCheckpointRepository
implements SearchCheckpointRepository {
  private readonly values =
    new Map<string, SearchIndexCheckpoint>();

  async get(
    consumerId: string,
  ) {
    return this.values.get(
      consumerId,
    );
  }

  async save(
    checkpoint:
      SearchIndexCheckpoint,
  ): Promise<void> {
    this.values.set(
      checkpoint.consumerId,
      checkpoint,
    );
  }
}

export class PassthroughSearchUnitOfWork
implements SearchUnitOfWork {
  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    return work();
  }
}
