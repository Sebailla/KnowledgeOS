import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { GraphProvider } from "./contracts/GraphProvider.js";
import type { GraphStore } from "./contracts/GraphStore.js";
import type { GraphEdge } from "./model/GraphEdge.js";
import type { GraphNode } from "./model/GraphNode.js";
import type { GraphPath } from "./model/GraphPath.js";
import type {
  NeighborQuery,
  TraverseQuery,
} from "./model/GraphQuery.js";

export class KnowledgeGraphEngine
implements Engine {
  public readonly id = "knowledge-graph";
  public readonly name = "Knowledge Graph Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "storage",
    "search",
  ] as const;

  private store: GraphStore | undefined;
  private running = false;

  public constructor(
    private readonly provider: GraphProvider,
    private readonly graphName = "knowledge",
  ) {}

  public async initialize(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();
    this.store =
      await this.provider.openGraph(this.graphName);
  }

  public async start(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation.throwIfCancellationRequested();

    if (!this.store) {
      throw new Error(
        "Knowledge Graph Engine must be initialized before start.",
      );
    }

    this.running = true;
  }

  public async stop(
    _context: EngineContext,
  ): Promise<void> {
    this.running = false;
  }

  public async dispose(
    _context: EngineContext,
  ): Promise<void> {
    await this.provider.close();
    this.store = undefined;
    this.running = false;
  }

  public async upsertNode(
    node: GraphNode,
  ): Promise<void> {
    await this.requireStore().upsertNode(node);
  }

  public async upsertEdge(
    edge: GraphEdge,
  ): Promise<void> {
    await this.requireStore().upsertEdge(edge);
  }

  public async neighbors(
    query: NeighborQuery,
  ): Promise<readonly GraphNode[]> {
    this.assertRunning();
    return this.requireStore().neighbors(query);
  }

  public async traverse(
    query: TraverseQuery,
  ): Promise<readonly GraphPath[]> {
    this.assertRunning();
    return this.requireStore().traverse(query);
  }

  private requireStore(): GraphStore {
    if (!this.store) {
      throw new Error(
        "Graph store is unavailable.",
      );
    }

    return this.store;
  }

  private assertRunning(): void {
    if (!this.running) {
      throw new Error(
        "Knowledge Graph Engine is not running.",
      );
    }
  }
}
