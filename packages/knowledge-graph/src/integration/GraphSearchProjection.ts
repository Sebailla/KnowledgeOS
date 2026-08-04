import type { GraphNode } from "../model/GraphNode.js";

export interface GraphSearchDocument {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
  readonly tags: readonly string[];
  readonly updatedAt: string;
}

export function graphNodeToSearchDocument(
  node: GraphNode,
  updatedAt: string,
): GraphSearchDocument {
  const body = Object.entries(node.properties)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");

  return {
    id: `graph-node:${node.id}`,
    title: node.label,
    body,
    metadata: {
      type: node.type,
    },
    tags: ["knowledge-graph", node.type],
    updatedAt,
  };
}
