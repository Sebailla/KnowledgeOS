import type { GraphEdge } from "./GraphEdge.js";
import type { GraphNode } from "./GraphNode.js";

export interface GraphPath {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}
