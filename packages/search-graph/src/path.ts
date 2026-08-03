import type {
  SearchGraphPath,
} from "./model.js";
import type {
  SearchGraphRepository,
} from "./contracts.js";

export class SearchGraphPathService {
  public constructor(
    private readonly graph:
      SearchGraphRepository,
  ) {}

  async shortestPath(
    fromNodeId: string,
    toNodeId: string,
    maximumDepth: number,
  ): Promise<
    SearchGraphPath | undefined
  > {
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
          totalWeight:
            current.totalWeight,
        };
      }

      if (
        current.edgeIds.length >=
        maximumDepth
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
        await this.graph.neighbors(
          current.nodeId,
        );

      for (const neighbor of neighbors) {
        if (
          current.nodeIds.includes(
            neighbor.node.nodeId,
          )
        ) {
          continue;
        }

        queue.push({
          nodeId:
            neighbor.node.nodeId,
          nodeIds: [
            ...current.nodeIds,
            neighbor.node.nodeId,
          ],
          edgeIds: [
            ...current.edgeIds,
            neighbor.edge.edgeId,
          ],
          totalWeight:
            current.totalWeight +
            neighbor.edge.weight,
        });
      }
    }

    return undefined;
  }
}
