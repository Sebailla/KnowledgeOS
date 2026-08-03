import type {
  UnifiedSearchEngine,
  UnifiedSearchHealth,
  UnifiedSearchRequest,
  UnifiedSearchResponse,
} from "@knowledgeos/search-api";
import {
  InMemorySearchCache,
  SearchRequestDeduplicator,
  serializeSearchCacheKey,
} from "@knowledgeos/search-cache";
import {
  SearchCircuitBreaker,
  SearchLatencyMetrics,
} from "@knowledgeos/search-resilience";

export interface SearchProductionRuntimeOptions {
  readonly cacheEntries: number;
  readonly cacheTtlMilliseconds: number;
}

export class SearchProductionRuntime
implements UnifiedSearchEngine {
  private readonly cache;
  private readonly deduplicator =
    new SearchRequestDeduplicator<UnifiedSearchResponse>();
  private readonly breaker =
    new SearchCircuitBreaker({
      failureThreshold: 3,
      recoveryTimeoutMilliseconds: 30_000,
    });
  private readonly latency =
    new SearchLatencyMetrics();

  public constructor(
    private readonly delegate: UnifiedSearchEngine,
    private readonly ownerId: string,
    private readonly options: SearchProductionRuntimeOptions,
  ) {
    this.cache =
      new InMemorySearchCache<UnifiedSearchResponse>(
        options.cacheEntries,
      );
  }

  async search(
    request: UnifiedSearchRequest,
  ): Promise<UnifiedSearchResponse> {
    const key = serializeSearchCacheKey({
      ownerId: this.ownerId,
      query: request.query,
      mode: request.mode,
      profile: request.rankingProfile,
      limit: request.limit,
      offset: request.offset,
    });

    const cached = this.cache.get(key);
    if (cached) return cached;

    return this.deduplicator.run(
      key,
      async () => {
        const startedAt = Date.now();

        try {
          const response =
            await this.breaker.execute(
              () => this.delegate.search(request),
            );

          this.cache.set(
            key,
            response,
            this.options.cacheTtlMilliseconds,
            response.results.map(
              (result) =>
                `search-document:${result.searchDocumentId}`,
            ),
          );

          this.latency.record({
            stage: "total",
            durationMilliseconds:
              Date.now() - startedAt,
            success: true,
          });

          return response;
        } catch (error) {
          this.latency.record({
            stage: "total",
            durationMilliseconds:
              Date.now() - startedAt,
            success: false,
          });
          throw error;
        }
      },
    );
  }

  health(): Promise<UnifiedSearchHealth> {
    return this.delegate.health();
  }

  invalidateSearchDocument(
    searchDocumentId: string,
  ): number {
    return this.cache.invalidateByTag(
      `search-document:${searchDocumentId}`,
    );
  }

  diagnostics() {
    return {
      cache: this.cache.metrics(),
      latency: this.latency.summary("total"),
      circuit: this.breaker.currentState(),
    };
  }
}
