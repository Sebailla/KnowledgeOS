import type { KnowledgeGraphEdge, KnowledgeGraphEdgeId, KnowledgeGraphId, KnowledgeGraphNode, KnowledgeGraphNodeId, KnowledgeGraphSnapshot } from "./model.js";

export interface KnowledgeGraphRepository {
  getNode(graphId: KnowledgeGraphId, nodeId: KnowledgeGraphNodeId): Promise<KnowledgeGraphNode | undefined>;
  getEdge(graphId: KnowledgeGraphId, edgeId: KnowledgeGraphEdgeId): Promise<KnowledgeGraphEdge | undefined>;
  upsertNode(node: KnowledgeGraphNode): Promise<void>;
  upsertEdge(edge: KnowledgeGraphEdge): Promise<void>;
  listNodes(graphId: KnowledgeGraphId): Promise<readonly KnowledgeGraphNode[]>;
  listEdges(graphId: KnowledgeGraphId): Promise<readonly KnowledgeGraphEdge[]>;
}

export interface KnowledgeGraphUnitOfWork { run<T>(work: () => Promise<T>): Promise<T>; }
export interface KnowledgeGraphSerializer { serialize(snapshot: KnowledgeGraphSnapshot): string; deserialize(value: string): KnowledgeGraphSnapshot; }
