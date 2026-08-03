import type { GraphStore } from "../contracts/GraphStore.js";
import { GraphIntegrityError } from "../errors/GraphIntegrityError.js";
import type { GraphEdge } from "../model/GraphEdge.js";
import type { GraphNode } from "../model/GraphNode.js";
import type { GraphPath } from "../model/GraphPath.js";
import type {
  NeighborQuery,
  TraverseQuery,
} from "../model/GraphQuery.js";

export class InMemoryGraphStore implements GraphStore {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly edges = new Map<string, GraphEdge>();
  private readonly outgoing = new Map<string, Set<string>>();
  private readonly incoming = new Map<string, Set<string>>();

  public async upsertNode(node: GraphNode): Promise<void> {
    this.nodes.set(node.id, node);
  }

  public async upsertEdge(edge: GraphEdge): Promise<void> {
    if (!this.nodes.has(edge.sourceId)) {
      throw new GraphIntegrityError(
        `Source node '${edge.sourceId}' does not exist.`,
      );
    }

    if (!this.nodes.has(edge.targetId)) {
      throw new GraphIntegrityError(
        `Target node '${edge.targetId}' does not exist.`,
      );
    }

    const previous = this.edges.get(edge.id);

    if (previous) {
      this.detach(previous);
    }

    this.edges.set(edge.id, edge);
    this.attach(edge);
  }

  public async removeNode(nodeId: string): Promise<boolean> {
    if (!this.nodes.has(nodeId)) {
      return false;
    }

    const related = new Set<string>([
      ...(this.outgoing.get(nodeId) ?? []),
      ...(this.incoming.get(nodeId) ?? []),
    ]);

    for (const edgeId of related) {
      await this.removeEdge(edgeId);
    }

    this.nodes.delete(nodeId);
    this.outgoing.delete(nodeId);
    this.incoming.delete(nodeId);

    return true;
  }

  public async removeEdge(edgeId: string): Promise<boolean> {
    const edge = this.edges.get(edgeId);

    if (!edge) {
      return false;
    }

    this.detach(edge);
    this.edges.delete(edgeId);

    return true;
  }

  public async getNode(
    nodeId: string,
  ): Promise<GraphNode | undefined> {
    return this.nodes.get(nodeId);
  }

  public async getEdge(
    edgeId: string,
  ): Promise<GraphEdge | undefined> {
    return this.edges.get(edgeId);
  }

  public async neighbors(
    query: NeighborQuery,
  ): Promise<readonly GraphNode[]> {
    const edges = this.matchingEdges(
      query.nodeId,
      query.direction ?? "both",
      query.edgeTypes,
    );

    const neighbors = new Map<string, GraphNode>();

    for (const edge of edges) {
      const otherId =
        edge.sourceId === query.nodeId
          ? edge.targetId
          : edge.sourceId;

      const node = this.nodes.get(otherId);

      if (node) {
        neighbors.set(node.id, node);
      }
    }

    return [...neighbors.values()]
      .sort((left, right) =>
        left.id.localeCompare(right.id),
      );
  }

  public async traverse(
    query: TraverseQuery,
  ): Promise<readonly GraphPath[]> {
    if (!this.nodes.has(query.startNodeId)) {
      return [];
    }

    if (
      !Number.isInteger(query.maxDepth) ||
      query.maxDepth < 0
    ) {
      throw new RangeError(
        "Graph maxDepth must be a non-negative integer.",
      );
    }

    const start = this.nodes.get(query.startNodeId)!;
    const paths: GraphPath[] = [];
    const work: Array<{
      readonly node: GraphNode;
      readonly nodes: readonly GraphNode[];
      readonly edges: readonly GraphEdge[];
      readonly depth: number;
    }> = [
      {
        node: start,
        nodes: [start],
        edges: [],
        depth: 0,
      },
    ];

    while (work.length > 0) {
      const current =
        query.strategy === "bfs"
          ? work.shift()
          : work.pop();

      if (!current) {
        break;
      }

      if (current.depth > 0) {
        paths.push({
          nodes: current.nodes,
          edges: current.edges,
        });
      }

      if (current.depth >= query.maxDepth) {
        continue;
      }

      const nextEdges = this.matchingEdges(
        current.node.id,
        "out",
        query.edgeTypes,
      );

      for (const edge of nextEdges) {
        const target = this.nodes.get(edge.targetId);

        if (!target) {
          continue;
        }

        if (
          current.nodes.some(
            (node) => node.id === target.id,
          )
        ) {
          continue;
        }

        work.push({
          node: target,
          nodes: [...current.nodes, target],
          edges: [...current.edges, edge],
          depth: current.depth + 1,
        });
      }
    }

    return paths;
  }

  public async clear(): Promise<void> {
    this.nodes.clear();
    this.edges.clear();
    this.outgoing.clear();
    this.incoming.clear();
  }

  private matchingEdges(
    nodeId: string,
    direction: "in" | "out" | "both",
    edgeTypes?: readonly string[],
  ): readonly GraphEdge[] {
    const ids = new Set<string>();

    if (direction === "out" || direction === "both") {
      for (const edgeId of this.outgoing.get(nodeId) ?? []) {
        ids.add(edgeId);
      }
    }

    if (direction === "in" || direction === "both") {
      for (const edgeId of this.incoming.get(nodeId) ?? []) {
        ids.add(edgeId);
      }
    }

    return [...ids]
      .map((edgeId) => this.edges.get(edgeId))
      .filter(
        (edge): edge is GraphEdge =>
          edge !== undefined &&
          (
            edgeTypes === undefined ||
            edgeTypes.includes(edge.type)
          ),
      )
      .sort((left, right) =>
        left.id.localeCompare(right.id),
      );
  }

  private attach(edge: GraphEdge): void {
    this.addIndex(this.outgoing, edge.sourceId, edge.id);
    this.addIndex(this.incoming, edge.targetId, edge.id);

    if (!edge.directed) {
      this.addIndex(this.outgoing, edge.targetId, edge.id);
      this.addIndex(this.incoming, edge.sourceId, edge.id);
    }
  }

  private detach(edge: GraphEdge): void {
    this.outgoing.get(edge.sourceId)?.delete(edge.id);
    this.incoming.get(edge.targetId)?.delete(edge.id);

    if (!edge.directed) {
      this.outgoing.get(edge.targetId)?.delete(edge.id);
      this.incoming.get(edge.sourceId)?.delete(edge.id);
    }
  }

  private addIndex(
    index: Map<string, Set<string>>,
    nodeId: string,
    edgeId: string,
  ): void {
    const entries = index.get(nodeId) ?? new Set<string>();
    entries.add(edgeId);
    index.set(nodeId, entries);
  }
}
