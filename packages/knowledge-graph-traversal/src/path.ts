import type {
  KnowledgeGraphTraversalReader,
} from "./contracts.js";
import type {
  GraphPathResult,
  GraphTraversalDirection,
} from "./model.js";

export class ShortestPathTraversal {
  public constructor(
    private readonly reader:
      KnowledgeGraphTraversalReader,
  ) {}

  async find(
    graphId: string,
    fromNodeId: string,
    toNodeId: string,
    options: {
      readonly maximumDepth: number;
      readonly direction:
        GraphTraversalDirection;
      readonly relationshipTypes?:
        readonly string[];
    },
  ): Promise<GraphPathResult | undefined> {
    const queue = [{
      nodeId:
        fromNodeId,
      nodeIds:
        [fromNodeId],
      edgeIds:
        [] as string[],
      totalWeight:
        0,
    }];

    const visited =
      new Set<string>();

    while (queue.length > 0) {
      const current =
        queue.shift()!;

      if (
        current.nodeId ===
        toNodeId
      ) {
        return {
          nodeIds:
            current.nodeIds,
          edgeIds:
            current.edgeIds,
          hopCount:
            current.edgeIds.length,
          totalWeight:
            current.totalWeight,
        };
      }

      if (
        current.edgeIds.length >=
        options.maximumDepth
      ) {
        continue;
      }

      if (
        visited.has(
          current.nodeId,
        )
      ) {
        continue;
      }

      visited.add(
        current.nodeId,
      );

      const neighbors =
        await this.reader.neighbors(
          graphId,
          current.nodeId,
          options.direction,
          options.relationshipTypes,
        );

      for (const neighbor of neighbors) {
        if (
          current.nodeIds.includes(
            neighbor.nodeId,
          )
        ) {
          continue;
        }

        queue.push({
          nodeId:
            neighbor.nodeId,
          nodeIds: [
            ...current.nodeIds,
            neighbor.nodeId,
          ],
          edgeIds: [
            ...current.edgeIds,
            neighbor.edgeId,
          ],
          totalWeight:
            current.totalWeight +
            neighbor.weight,
        });
      }
    }

    return undefined;
  }
}
