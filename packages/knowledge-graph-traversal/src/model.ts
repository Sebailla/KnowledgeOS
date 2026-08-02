export type GraphTraversalDirection =
  | "outgoing"
  | "incoming"
  | "both";

export interface GraphTraversalOptions {
  readonly maximumDepth: number;
  readonly direction: GraphTraversalDirection;
  readonly relationshipTypes?: readonly string[];
  readonly minimumEdgeWeight?: number;
  readonly includeStart: boolean;
}

export interface GraphTraversalVisit {
  readonly nodeId: string;
  readonly depth: number;
  readonly parentNodeId?: string;
  readonly viaEdgeId?: string;
  readonly viaRelationshipType?: string;
  readonly accumulatedWeight: number;
}

export interface GraphPathResult {
  readonly nodeIds: readonly string[];
  readonly edgeIds: readonly string[];
  readonly hopCount: number;
  readonly totalWeight: number;
}

export interface GraphNeighbor {
  readonly nodeId: string;
  readonly edgeId: string;
  readonly relationshipType: string;
  readonly weight: number;
  readonly direction:
    | "outgoing"
    | "incoming";
}
