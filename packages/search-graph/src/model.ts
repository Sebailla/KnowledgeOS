export type SearchGraphRelationshipType =
  | "contains"
  | "references"
  | "mentions"
  | "derived-from"
  | "annotates"
  | "duplicates"
  | "similar-to"
  | "parent"
  | "child"
  | "version"
  | "source"
  | "asset";

export interface SearchGraphNode {
  readonly nodeId: string;
  readonly searchDocumentId?: string;
  readonly kind: string;
  readonly label: string;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface SearchGraphEdge {
  readonly edgeId: string;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly type: SearchGraphRelationshipType;
  readonly weight: number;
  readonly directed: boolean;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface SearchGraphTraversalStep {
  readonly nodeId: string;
  readonly depth: number;
  readonly score: number;
  readonly viaEdgeId?: string;
  readonly viaRelationship?: SearchGraphRelationshipType;
  readonly parentNodeId?: string;
}

export interface SearchGraphPath {
  readonly nodeIds: readonly string[];
  readonly edgeIds: readonly string[];
  readonly totalWeight: number;
}

export interface SearchGraphExplanation {
  readonly searchDocumentId: string;
  readonly reasons:
    readonly {
      readonly nodeId: string;
      readonly relationship:
        SearchGraphRelationshipType;
      readonly relatedNodeId: string;
      readonly depth: number;
      readonly contribution: number;
    }[];
}
