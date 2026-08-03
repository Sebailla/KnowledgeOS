import type {
  GraphNeighbor,
  GraphTraversalDirection,
} from "./model.js";

export interface KnowledgeGraphTraversalReader {
  neighbors(
    graphId: string,
    nodeId: string,
    direction: GraphTraversalDirection,
    relationshipTypes?: readonly string[],
    minimumEdgeWeight?: number,
  ): Promise<readonly GraphNeighbor[]>;
}

export interface KnowledgeGraphNodeExistenceReader {
  exists(
    graphId: string,
    nodeId: string,
  ): Promise<boolean>;
}
