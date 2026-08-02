import {
  BreadthFirstTraversal,
  DepthFirstTraversal,
  ShortestPathTraversal,
  WeightedGraphTraversal,
} from "@knowledgeos/knowledge-graph-traversal";
import type {
  GraphTraversalDirection,
  KnowledgeGraphTraversalReader,
} from "@knowledgeos/knowledge-graph-traversal";

export type KnowledgeGraphTraversalMode =
  | "bfs"
  | "dfs"
  | "weighted";

export class KnowledgeGraphTraversalRuntime {
  public constructor(
    private readonly reader:
      KnowledgeGraphTraversalReader,
  ) {}

  async traverse(
    graphId: string,
    startNodeId: string,
    input: {
      readonly mode:
        KnowledgeGraphTraversalMode;
      readonly maximumDepth: number;
      readonly direction:
        GraphTraversalDirection;
      readonly relationshipTypes?:
        readonly string[];
      readonly minimumEdgeWeight?:
        number;
      readonly minimumScore?:
        number;
      readonly decayPerDepth?:
        number;
      readonly includeStart?: boolean;
    },
  ) {
    if (
      input.mode ===
      "bfs"
    ) {
      return new BreadthFirstTraversal(
        this.reader,
      ).traverse(
        graphId,
        startNodeId,
        {
          maximumDepth:
            input.maximumDepth,
          direction:
            input.direction,
          ...(input.relationshipTypes
            ? {
                relationshipTypes:
                  input.relationshipTypes,
              }
            : {}),
          ...(input.minimumEdgeWeight !==
          undefined
            ? {
                minimumEdgeWeight:
                  input.minimumEdgeWeight,
              }
            : {}),
          includeStart:
            input.includeStart ?? true,
        },
      );
    }

    if (
      input.mode ===
      "dfs"
    ) {
      return new DepthFirstTraversal(
        this.reader,
      ).traverse(
        graphId,
        startNodeId,
        {
          maximumDepth:
            input.maximumDepth,
          direction:
            input.direction,
          ...(input.relationshipTypes
            ? {
                relationshipTypes:
                  input.relationshipTypes,
              }
            : {}),
          ...(input.minimumEdgeWeight !==
          undefined
            ? {
                minimumEdgeWeight:
                  input.minimumEdgeWeight,
              }
            : {}),
          includeStart:
            input.includeStart ?? true,
        },
      );
    }

    return new WeightedGraphTraversal(
      this.reader,
    ).traverse(
      graphId,
      startNodeId,
      {
        maximumDepth:
          input.maximumDepth,
        direction:
          input.direction,
        ...(input.relationshipTypes
          ? {
              relationshipTypes:
                input.relationshipTypes,
            }
          : {}),
        minimumScore:
          input.minimumScore ?? 0.01,
        decayPerDepth:
          input.decayPerDepth ?? 0.85,
      },
    );
  }

  async shortestPath(
    graphId: string,
    fromNodeId: string,
    toNodeId: string,
    input: {
      readonly maximumDepth: number;
      readonly direction:
        GraphTraversalDirection;
      readonly relationshipTypes?:
        readonly string[];
    },
  ) {
    return new ShortestPathTraversal(
      this.reader,
    ).find(
      graphId,
      fromNodeId,
      toNodeId,
      input,
    );
  }
}
