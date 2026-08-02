export type KnowledgeGraphNodeId = string & { readonly __brand: "KnowledgeGraphNodeId" };
export type KnowledgeGraphEdgeId = string & { readonly __brand: "KnowledgeGraphEdgeId" };
export type KnowledgeGraphId = string & { readonly __brand: "KnowledgeGraphId" };

export type KnowledgeGraphValue = string | number | boolean | null;

export interface KnowledgeGraphNode {
  readonly graphId: KnowledgeGraphId;
  readonly nodeId: KnowledgeGraphNodeId;
  readonly type: string;
  readonly labels: readonly string[];
  readonly properties: Readonly<Record<string, KnowledgeGraphValue>>;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string;
}

export interface KnowledgeGraphEdge {
  readonly graphId: KnowledgeGraphId;
  readonly edgeId: KnowledgeGraphEdgeId;
  readonly fromNodeId: KnowledgeGraphNodeId;
  readonly toNodeId: KnowledgeGraphNodeId;
  readonly type: string;
  readonly directed: boolean;
  readonly weight: number;
  readonly properties: Readonly<Record<string, KnowledgeGraphValue>>;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string;
}

export interface KnowledgeGraphSnapshot {
  readonly graphId: KnowledgeGraphId;
  readonly nodes: readonly KnowledgeGraphNode[];
  readonly edges: readonly KnowledgeGraphEdge[];
  readonly createdAt: string;
}
