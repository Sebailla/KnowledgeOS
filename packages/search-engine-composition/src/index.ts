import { Bm25Index } from "@knowledgeos/search-bm25";
import {
  DeterministicSearchReranker,
} from "@knowledgeos/search-reranker";
import {
  SearchSnippetGenerator,
} from "@knowledgeos/search-snippets";

export interface ConsolidatedSearchDocument {
  readonly documentId: string;
  readonly title: string;
  readonly content: string;
  readonly kind: string;
  readonly personalBoost?: number;
}

export interface ConsolidatedSearchResult {
  readonly documentId: string;
  readonly title: string;
  readonly kind: string;
  readonly score: number;
  readonly snippet: string;
  readonly explanation: Readonly<Record<string, number>>;
}

export class ConsolidatedSearchEngine {
  private readonly documents =
    new Map<string, ConsolidatedSearchDocument>();
  private readonly bm25 = new Bm25Index();
  private readonly reranker =
    new DeterministicSearchReranker();
  private readonly snippets =
    new SearchSnippetGenerator();

  upsert(document: ConsolidatedSearchDocument): void {
    this.documents.set(document.documentId, document);
    this.bm25.upsert({
      documentId: document.documentId,
      terms: tokenize(`${document.title} ${document.content}`),
    });
  }

  remove(documentId: string): boolean {
    this.bm25.remove(documentId);
    return this.documents.delete(documentId);
  }

  search(query: string, limit = 20): readonly ConsolidatedSearchResult[] {
    const lexical = this.bm25.search(tokenize(query));
    const reranked = this.reranker.rerank(
      query,
      lexical.map((result) => {
        const document = this.documents.get(result.documentId)!;
        return {
          documentId: document.documentId,
          baseScore: result.score,
          title: document.title,
          content: document.content,
          ...(document.personalBoost === undefined
            ? {}
            : { personalBoost: document.personalBoost }),
        };
      }),
    );

    return reranked.slice(0, limit).map((value) => {
      const document = this.documents.get(value.documentId)!;
      const snippet = this.snippets.generate(
        document.content,
        tokenize(query),
      );

      return {
        documentId: document.documentId,
        title: document.title,
        kind: document.kind,
        score: value.finalScore,
        snippet: this.snippets.highlight(snippet),
        explanation: value.contributions,
      };
    });
  }
}

function tokenize(value: string): readonly string[] {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}
