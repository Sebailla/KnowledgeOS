import type { SearchIndex } from "../contracts/SearchIndex.js";
import type { SearchDocument } from "../model/SearchDocument.js";
import type { SearchFilter, SearchQuery } from "../model/SearchQuery.js";
import type { SearchHit, SearchResult } from "../model/SearchResult.js";

export class InMemorySearchIndex implements SearchIndex {
  private readonly documents =
    new Map<string, SearchDocument>();

  public async upsert(
    document: SearchDocument,
  ): Promise<void> {
    this.documents.set(document.id, document);
  }

  public async remove(
    documentId: string,
  ): Promise<boolean> {
    return this.documents.delete(documentId);
  }

  public async get(
    documentId: string,
  ): Promise<SearchDocument | undefined> {
    return this.documents.get(documentId);
  }

  public async clear(): Promise<void> {
    this.documents.clear();
  }

  public async search(
    query: SearchQuery,
  ): Promise<SearchResult> {
    const terms = normalizeTerms(query.text);

    let hits = [...this.documents.values()]
      .filter((document) =>
        query.filters.every((filter) =>
          matchesFilter(document, filter),
        ),
      )
      .map((document) => scoreDocument(document, terms))
      .filter((hit) =>
        terms.length === 0 || hit.score > 0,
      );

    for (const sort of [...query.sort].reverse()) {
      hits = [...hits].sort((left, right) => {
        const direction =
          sort.direction === "asc" ? 1 : -1;

        if (sort.field === "score") {
          return (left.score - right.score) * direction;
        }

        if (sort.field === "updatedAt") {
          return left.document.updatedAt
            .localeCompare(right.document.updatedAt) * direction;
        }

        return left.document.title
          .localeCompare(right.document.title) * direction;
      });
    }

    const total = hits.length;

    return {
      total,
      hits: hits.slice(
        query.offset,
        query.offset + query.limit,
      ),
    };
  }
}

function normalizeTerms(text: string): readonly string[] {
  return text
    .toLocaleLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 0);
}

function matchesFilter(
  document: SearchDocument,
  filter: SearchFilter,
): boolean {
  if (filter.kind === "tag") {
    return document.tags.some(
      (tag) =>
        tag.toLocaleLowerCase() ===
        filter.value.toLocaleLowerCase(),
    );
  }

  return document.metadata[filter.field] === filter.value;
}

function scoreDocument(
  document: SearchDocument,
  terms: readonly string[],
): SearchHit {
  const title =
    document.title.toLocaleLowerCase();
  const body =
    document.body.toLocaleLowerCase();
  const tags =
    document.tags.map((tag) => tag.toLocaleLowerCase());

  let score = 0;
  const matchedTerms: string[] = [];

  for (const term of terms) {
    let matched = false;

    if (title.includes(term)) {
      score += 5;
      matched = true;
    }

    const bodyMatches =
      body.split(term).length - 1;

    if (bodyMatches > 0) {
      score += Math.min(bodyMatches, 10);
      matched = true;
    }

    if (tags.some((tag) => tag.includes(term))) {
      score += 3;
      matched = true;
    }

    if (matched) {
      matchedTerms.push(term);
    }
  }

  return {
    document,
    score,
    matchedTerms,
  };
}
