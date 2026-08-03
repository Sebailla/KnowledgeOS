import type {
  SearchGraphRepository,
} from "./contracts.js";
import type {
  SearchGraphEdge,
  SearchGraphNode,
  SearchGraphRelationshipType,
} from "./model.js";

export class InMemorySearchGraphRepository
implements SearchGraphRepository {
  private readonly nodes =
    new Map<string, SearchGraphNode>();
  private readonly edges =
    new Map<string, SearchGraphEdge>();

  async upsertNode(
    node: SearchGraphNode,
  ): Promise<void> {
    this.nodes.set(
      node.nodeId,
      node,
    );
  }

  async upsertEdge(
    edge: SearchGraphEdge,
  ): Promise<void> {
    this.edges.set(
      edge.edgeId,
      edge,
    );
  }

  async getNode(
    nodeId: string,
  ) {
    return this.nodes.get(
      nodeId,
    );
  }

  async neighbors(
    nodeId: string,
    relationshipTypes?:
      readonly SearchGraphRelationshipType[],
  ) {
    const result: {
      node: SearchGraphNode;
      edge: SearchGraphEdge;
    }[] = [];

    for (const edge of this.edges.values()) {
      if (
        relationshipTypes &&
        !relationshipTypes.includes(
          edge.type,
        )
      ) {
        continue;
      }

      if (
        edge.fromNodeId ===
        nodeId
      ) {
        const node =
          this.nodes.get(
            edge.toNodeId,
          );
        if (node) {
          result.push({
            node,
            edge,
          });
        }
      }

      if (
        !edge.directed &&
        edge.toNodeId ===
        nodeId
      ) {
        const node =
          this.nodes.get(
            edge.fromNodeId,
          );
        if (node) {
          result.push({
            node,
            edge,
          });
        }
      }
    }

    return result;
  }

  async allNodes() {
    return [
      ...this.nodes.values(),
    ];
  }

  async allEdges() {
    return [
      ...this.edges.values(),
    ];
  }
}
