import type {
  SearchEmbeddingProvider,
} from "@knowledgeos/search-embedding";
import {
  ReciprocalRankFusion,
} from "./fusion.js";
import type {
  HybridSearchResult,
  LexicalCandidate,
  SemanticCandidate,
} from "./model.js";

export interface LexicalSearchPort {
  search(
    query: string,
    limit: number,
  ): Promise<
    readonly LexicalCandidate[]
  >;
}

export interface SemanticSearchPort {
  search(
    modelId: string,
    vector: readonly number[],
    limit: number,
  ): Promise<
    readonly SemanticCandidate[]
  >;
}

export class HybridSearchRuntime {
  private readonly fusion =
    new ReciprocalRankFusion();

  public constructor(
    private readonly lexical:
      LexicalSearchPort,
    private readonly semantic:
      SemanticSearchPort,
    private readonly embeddings:
      SearchEmbeddingProvider,
  ) {}

  async search(
    query: string,
    limit: number,
  ): Promise<
    readonly HybridSearchResult[]
  > {
    const [queryEmbedding] =
      await this.embeddings.embed([
        {
          searchDocumentId:
            "query",
          text:
            query,
          contentFingerprint:
            `query:${query}`,
        },
      ]);

    if (!queryEmbedding) {
      return [];
    }

    const [
      lexicalCandidates,
      semanticCandidates,
    ] = await Promise.all([
      this.lexical.search(
        query,
        limit,
      ),
      this.semantic.search(
        queryEmbedding.modelId,
        queryEmbedding.vector,
        limit,
      ),
    ]);

    return this.fusion
      .fuse(
        lexicalCandidates,
        semanticCandidates,
        {
          lexical:
            1,
          semantic:
            1,
          reciprocalRankConstant:
            60,
        },
      )
      .slice(
        0,
        limit,
      );
  }
}
