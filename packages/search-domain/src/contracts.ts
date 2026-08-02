import type {
  SearchDocument,
  SearchIndexCheckpoint,
  SearchIndexCommand,
} from "./model.js";

export interface SearchDocumentRepository {
  get(
    searchDocumentId: string,
  ): Promise<SearchDocument | undefined>;

  upsert(
    document: SearchDocument,
  ): Promise<void>;

  delete(
    searchDocumentId: string,
  ): Promise<void>;
}

export interface SearchCommandRepository {
  append(
    commands:
      readonly SearchIndexCommand[],
  ): Promise<void>;

  listAfter(
    sequence: number,
    limit: number,
  ): Promise<
    readonly SearchIndexCommand[]
  >;
}

export interface SearchCheckpointRepository {
  get(
    consumerId: string,
  ): Promise<SearchIndexCheckpoint | undefined>;

  save(
    checkpoint:
      SearchIndexCheckpoint,
  ): Promise<void>;
}

export interface SearchUnitOfWork {
  run<T>(
    work: () => Promise<T>,
  ): Promise<T>;
}
