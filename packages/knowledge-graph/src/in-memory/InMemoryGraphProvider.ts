import type { GraphProvider } from "../contracts/GraphProvider.js";
import type { GraphStore } from "../contracts/GraphStore.js";
import { InMemoryGraphStore } from "./InMemoryGraphStore.js";

export class InMemoryGraphProvider
implements GraphProvider {
  public readonly id = "in-memory";

  private readonly graphs =
    new Map<string, InMemoryGraphStore>();

  private closed = false;

  public async openGraph(
    name: string,
  ): Promise<GraphStore> {
    if (this.closed) {
      throw new Error(
        "Graph provider is closed.",
      );
    }

    const existing = this.graphs.get(name);

    if (existing) {
      return existing;
    }

    const created = new InMemoryGraphStore();
    this.graphs.set(name, created);

    return created;
  }

  public async close(): Promise<void> {
    this.closed = true;
    this.graphs.clear();
  }
}
