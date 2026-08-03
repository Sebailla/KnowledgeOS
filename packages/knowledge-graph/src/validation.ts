import type { KnowledgeGraphEdge, KnowledgeGraphNode, KnowledgeGraphSnapshot } from "./model.js";

const idPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,255}$/;
function validateVersion(version: number): void {
  if (!Number.isInteger(version) || version < 1) throw new Error("version must be a positive integer");
}
export function validateKnowledgeGraphNode(node: KnowledgeGraphNode): void {
  if (!idPattern.test(node.nodeId)) throw new Error("Invalid nodeId");
  if (!node.type.trim()) throw new Error("Node type is required");
  validateVersion(node.version);
}
export function validateKnowledgeGraphEdge(edge: KnowledgeGraphEdge): void {
  if (!idPattern.test(edge.edgeId)) throw new Error("Invalid edgeId");
  if (!edge.type.trim()) throw new Error("Edge type is required");
  if (!Number.isFinite(edge.weight) || edge.weight < 0) throw new Error("Edge weight must be non-negative");
  validateVersion(edge.version);
}
export function validateKnowledgeGraphSnapshot(snapshot: KnowledgeGraphSnapshot): void {
  const nodes = new Set(snapshot.nodes.map(n => n.nodeId));
  for (const node of snapshot.nodes) validateKnowledgeGraphNode(node);
  for (const edge of snapshot.edges) {
    validateKnowledgeGraphEdge(edge);
    if (!nodes.has(edge.fromNodeId) || !nodes.has(edge.toNodeId)) throw new Error(`Dangling edge: ${edge.edgeId}`);
  }
}
