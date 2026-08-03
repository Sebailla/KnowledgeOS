import type { KnowledgeGraphEdge, KnowledgeGraphEdgeId, KnowledgeGraphId, KnowledgeGraphNode, KnowledgeGraphNodeId, KnowledgeGraphRepository, KnowledgeGraphUnitOfWork } from "@knowledgeos/knowledge-graph";
export class InMemoryKnowledgeGraphRepository implements KnowledgeGraphRepository {
  private nodes=new Map<string,KnowledgeGraphNode>(); private edges=new Map<string,KnowledgeGraphEdge>();
  private key(graphId: KnowledgeGraphId,id:string){return `${graphId}::${id}`;}
  async getNode(g:KnowledgeGraphId,n:KnowledgeGraphNodeId){return this.nodes.get(this.key(g,n));}
  async getEdge(g:KnowledgeGraphId,e:KnowledgeGraphEdgeId){return this.edges.get(this.key(g,e));}
  async upsertNode(n:KnowledgeGraphNode){this.nodes.set(this.key(n.graphId,n.nodeId),n);}
  async upsertEdge(e:KnowledgeGraphEdge){this.edges.set(this.key(e.graphId,e.edgeId),e);}
  async listNodes(g:KnowledgeGraphId){return [...this.nodes.values()].filter(v=>v.graphId===g && !v.deletedAt).sort((a,b)=>a.nodeId.localeCompare(b.nodeId));}
  async listEdges(g:KnowledgeGraphId){return [...this.edges.values()].filter(v=>v.graphId===g && !v.deletedAt).sort((a,b)=>a.edgeId.localeCompare(b.edgeId));}
}
export class PassthroughKnowledgeGraphUnitOfWork implements KnowledgeGraphUnitOfWork { run<T>(work:()=>Promise<T>):Promise<T>{return work();} }
