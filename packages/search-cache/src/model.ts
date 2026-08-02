export interface SearchCacheKey {
  readonly ownerId: string;
  readonly query: string;
  readonly mode: string;
  readonly profile: string;
  readonly limit: number;
  readonly offset: number;
}

export interface SearchCacheEntry<T> {
  readonly key: string;
  readonly value: T;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly tags: readonly string[];
}

export interface SearchCacheMetrics {
  readonly hits: number;
  readonly misses: number;
  readonly evictions: number;
  readonly invalidations: number;
}
