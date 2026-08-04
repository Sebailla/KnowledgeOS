import type { DeduplicationStore } from "../contracts/DeduplicationStore.js";

export class InMemoryDeduplicationStore
implements DeduplicationStore {
  private readonly fingerprints = new Set<string>();

  public async has(
    fingerprint: string,
  ): Promise<boolean> {
    return this.fingerprints.has(fingerprint);
  }

  public async add(
    fingerprint: string,
  ): Promise<void> {
    this.fingerprints.add(fingerprint);
  }
}
