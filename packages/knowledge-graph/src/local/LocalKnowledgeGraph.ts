import type { GraphEdge } from "../model/GraphEdge.js";
import type { GraphNode } from "../model/GraphNode.js";
import type { GraphPath } from "../model/GraphPath.js";

export interface GraphSubgraph {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}

export interface LocalGraphStatistics {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly nodeTypes: Readonly<Record<string, number>>;
  readonly edgeTypes: Readonly<Record<string, number>>;
  readonly connectedComponents: number;
}

export class LocalKnowledgeGraph {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly edges = new Map<string, GraphEdge>();

  public upsertNode(node: GraphNode): GraphNode {
    this.nodes.set(node.id, node);
    return node;
  }

  public deleteNode(id: string): boolean {
    const deleted = this.nodes.delete(id);
    if (deleted) {
      for (const [edgeId, edge] of this.edges) {
        if (edge.sourceId === id || edge.targetId === id) {
          this.edges.delete(edgeId);
        }
      }
    }
    return deleted;
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public upsertEdge(edge: GraphEdge): GraphEdge {
    if (!this.nodes.has(edge.sourceId) || !this.nodes.has(edge.targetId)) {
      throw new Error("Graph edge endpoints must exist.");
    }
    this.edges.set(edge.id, edge);
    return edge;
  }

  public deleteEdge(id: string): boolean {
    return this.edges.delete(id);
  }

  public neighbors(
    nodeId: string,
    direction: "in" | "out" | "both" = "both",
  ): GraphSubgraph {
    const edges = [...this.edges.values()].filter((edge) => {
      if (direction === "in") return edge.targetId === nodeId;
      if (direction === "out") return edge.sourceId === nodeId;
      return edge.sourceId === nodeId || edge.targetId === nodeId;
    });
    const ids = new Set<string>([nodeId]);
    for (const edge of edges) {
      ids.add(edge.sourceId); ids.add(edge.targetId);
    }
    return {
      nodes: [...ids].map((id) => this.nodes.get(id)).filter((node): node is GraphNode => node !== undefined),
      edges,
    };
  }

  public expand(nodeId: string, depth = 1): GraphSubgraph {
    const visited = new Set<string>([nodeId]);
    const selectedEdges = new Map<string, GraphEdge>();
    let frontier = [nodeId];
    for (let level = 0; level < Math.max(0, depth); level += 1) {
      const next: string[] = [];
      for (const current of frontier) {
        for (const edge of this.edges.values()) {
          if (edge.sourceId !== current && edge.targetId !== current) continue;
          selectedEdges.set(edge.id, edge);
          const other = edge.sourceId === current ? edge.targetId : edge.sourceId;
          if (!visited.has(other)) { visited.add(other); next.push(other); }
        }
      }
      frontier = next;
      if (frontier.length === 0) break;
    }
    return {
      nodes: [...visited].map((id) => this.nodes.get(id)).filter((node): node is GraphNode => node !== undefined),
      edges: [...selectedEdges.values()],
    };
  }

  public shortestPath(sourceId: string, targetId: string): GraphPath | undefined {
    if (!this.nodes.has(sourceId) || !this.nodes.has(targetId)) return undefined;
    const queue = [sourceId];
    const previous = new Map<string, { nodeId: string; edge: GraphEdge }>();
    const seen = new Set<string>([sourceId]);
    while (queue.length) {
      const current = queue.shift()!;
      if (current === targetId) break;
      for (const edge of this.edges.values()) {
        if (edge.sourceId !== current && edge.targetId !== current) continue;
        const next = edge.sourceId === current ? edge.targetId : edge.sourceId;
        if (seen.has(next)) continue;
        seen.add(next); previous.set(next, { nodeId: current, edge }); queue.push(next);
      }
    }
    if (!seen.has(targetId)) return undefined;
    const nodeIds = [targetId]; const pathEdges: GraphEdge[] = [];
    let cursor = targetId;
    while (cursor !== sourceId) {
      const step = previous.get(cursor); if (!step) return undefined;
      pathEdges.unshift(step.edge); cursor = step.nodeId; nodeIds.unshift(cursor);
    }
    return { nodes: nodeIds.map((id) => this.nodes.get(id)!), edges: pathEdges };
  }

  public search(text: string, types: readonly string[] = []): readonly GraphNode[] {
    const normalized = text.trim().toLocaleLowerCase();
    return [...this.nodes.values()].filter((node) => {
      if (types.length && !types.includes(node.type)) return false;
      if (!normalized) return true;
      return `${node.label} ${JSON.stringify(node.properties)}`.toLocaleLowerCase().includes(normalized);
    }).sort((a,b)=>a.label.localeCompare(b.label));
  }

  public rebuild(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): void {
    this.nodes.clear(); this.edges.clear();
    for (const node of nodes) this.upsertNode(node);
    for (const edge of edges) this.upsertEdge(edge);
  }

  public statistics(): LocalGraphStatistics {
    const nodeTypes: Record<string, number> = {};
    const edgeTypes: Record<string, number> = {};
    for (const node of this.nodes.values()) nodeTypes[node.type] = (nodeTypes[node.type] ?? 0) + 1;
    for (const edge of this.edges.values()) edgeTypes[edge.type] = (edgeTypes[edge.type] ?? 0) + 1;
    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      nodeTypes,
      edgeTypes,
      connectedComponents: this.components(),
    };
  }

  private components(): number {
    const remaining = new Set(this.nodes.keys()); let count = 0;
    while (remaining.size) {
      count += 1; const start = remaining.values().next().value as string; const queue=[start]; remaining.delete(start);
      while(queue.length){ const current=queue.shift()!; for(const edge of this.edges.values()){ if(edge.sourceId!==current && edge.targetId!==current) continue; const other=edge.sourceId===current?edge.targetId:edge.sourceId; if(remaining.delete(other)) queue.push(other); } }
    }
    return count;
  }
}
