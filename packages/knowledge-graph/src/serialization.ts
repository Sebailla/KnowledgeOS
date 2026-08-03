import type { KnowledgeGraphSerializer } from "./contracts.js";
import type { KnowledgeGraphSnapshot } from "./model.js";
import { validateKnowledgeGraphSnapshot } from "./validation.js";

export class JsonKnowledgeGraphSerializer implements KnowledgeGraphSerializer {
  serialize(snapshot: KnowledgeGraphSnapshot): string {
    validateKnowledgeGraphSnapshot(snapshot);
    return JSON.stringify({
      graphId: snapshot.graphId,
      nodes: [...snapshot.nodes].sort((a,b)=>a.nodeId.localeCompare(b.nodeId)),
      edges: [...snapshot.edges].sort((a,b)=>a.edgeId.localeCompare(b.edgeId)),
      createdAt: snapshot.createdAt,
    });
  }
  deserialize(value: string): KnowledgeGraphSnapshot {
    const parsed = JSON.parse(value) as KnowledgeGraphSnapshot;
    validateKnowledgeGraphSnapshot(parsed);
    return parsed;
  }
}
