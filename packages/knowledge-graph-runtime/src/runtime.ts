import type { KnowledgeGraphEdge, KnowledgeGraphNode, KnowledgeGraphRepository, KnowledgeGraphSnapshot, KnowledgeGraphUnitOfWork } from "@knowledgeos/knowledge-graph";
import { validateKnowledgeGraphEdge, validateKnowledgeGraphNode, validateKnowledgeGraphSnapshot } from "@knowledgeos/knowledge-graph";

export class KnowledgeGraphRuntime {
  public constructor(private readonly repository: KnowledgeGraphRepository, private readonly unitOfWork: KnowledgeGraphUnitOfWork) {}
  async upsertNode(node: KnowledgeGraphNode): Promise<void> { validateKnowledgeGraphNode(node); await this.unitOfWork.run(()=>this.repository.upsertNode(node)); }
  async upsertEdge(edge: KnowledgeGraphEdge): Promise<void> {
    validateKnowledgeGraphEdge(edge);
    const [from,to]=await Promise.all([this.repository.getNode(edge.graphId,edge.fromNodeId),this.repository.getNode(edge.graphId,edge.toNodeId)]);
    if (!from || !to) throw new Error("Edge endpoints must exist");
    await this.unitOfWork.run(()=>this.repository.upsertEdge(edge));
  }
  async snapshot(graphId: KnowledgeGraphNode["graphId"], createdAt: string): Promise<KnowledgeGraphSnapshot> {
    const snapshot={graphId,nodes:await this.repository.listNodes(graphId),edges:await this.repository.listEdges(graphId),createdAt};
    validateKnowledgeGraphSnapshot(snapshot); return snapshot;
  }
}
