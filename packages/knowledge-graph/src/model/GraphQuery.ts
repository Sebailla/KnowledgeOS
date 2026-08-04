export interface NeighborQuery {
  readonly nodeId: string;
  readonly direction?: "in" | "out" | "both";
  readonly edgeTypes?: readonly string[];
}

export interface TraverseQuery {
  readonly startNodeId: string;
  readonly strategy: "bfs" | "dfs";
  readonly maxDepth: number;
  readonly edgeTypes?: readonly string[];
}
