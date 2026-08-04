import type { GraphEdge } from "../model/GraphEdge.js";
import type { GraphNode } from "../model/GraphNode.js";
import type {
  NeighborQuery,
  TraverseQuery,
} from "../model/GraphQuery.js";
import type { GraphPath } from "../model/GraphPath.js";

export interface GraphStore {
  upsertNode(node: GraphNode): Promise<void>;
  upsertEdge(edge: GraphEdge): Promise<void>;
  removeNode(nodeId: string): Promise<boolean>;
  removeEdge(edgeId: string): Promise<boolean>;
  getNode(nodeId: string): Promise<GraphNode | undefined>;
  getEdge(edgeId: string): Promise<GraphEdge | undefined>;
  neighbors(query: NeighborQuery): Promise<readonly GraphNode[]>;
  traverse(query: TraverseQuery): Promise<readonly GraphPath[]>;
  clear(): Promise<void>;
}
