export class SearchRequestDeduplicator<T> {
  private readonly inFlight =
    new Map<string, Promise<T>>();

  run(
    key: string,
    execute: () => Promise<T>,
  ): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) return existing;

    const current = execute()
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, current);
    return current;
  }
}
