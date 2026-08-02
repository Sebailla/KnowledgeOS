import type {
  SearchCacheEntry,
  SearchCacheMetrics,
} from "./model.js";

export class InMemorySearchCache<T> {
  private readonly values =
    new Map<string, SearchCacheEntry<T>>();

  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private invalidations = 0;

  public constructor(
    private readonly maximumEntries: number,
    private readonly now: () => number = Date.now,
  ) {}

  get(key: string): T | undefined {
    const entry = this.values.get(key);

    if (!entry) {
      this.misses += 1;
      return undefined;
    }

    if (entry.expiresAt <= this.now()) {
      this.values.delete(key);
      this.misses += 1;
      this.evictions += 1;
      return undefined;
    }

    this.values.delete(key);
    this.values.set(key, entry);
    this.hits += 1;
    return entry.value;
  }

  set(
    key: string,
    value: T,
    ttlMilliseconds: number,
    tags: readonly string[] = [],
  ): void {
    if (ttlMilliseconds <= 0) {
      throw new Error("ttlMilliseconds must be positive");
    }

    if (!this.values.has(key) &&
        this.values.size >= this.maximumEntries) {
      const oldest = this.values.keys().next().value;
      if (oldest !== undefined) {
        this.values.delete(oldest);
        this.evictions += 1;
      }
    }

    const createdAt = this.now();

    this.values.set(key, {
      key,
      value,
      createdAt,
      expiresAt: createdAt + ttlMilliseconds,
      tags: [...new Set(tags)].sort(),
    });
  }

  invalidateByTag(tag: string): number {
    let removed = 0;

    for (const [key, entry] of this.values.entries()) {
      if (entry.tags.includes(tag)) {
        this.values.delete(key);
        removed += 1;
      }
    }

    this.invalidations += removed;
    return removed;
  }

  clear(): void {
    this.invalidations += this.values.size;
    this.values.clear();
  }

  metrics(): SearchCacheMetrics {
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      invalidations: this.invalidations,
    };
  }
}
