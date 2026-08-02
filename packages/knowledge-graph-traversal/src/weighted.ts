import type {
  KnowledgeGraphTraversalReader,
} from "./contracts.js";
import type {
  GraphTraversalDirection,
  GraphTraversalVisit,
} from "./model.js";

export class WeightedGraphTraversal {
  public constructor(
    private readonly reader:
      KnowledgeGraphTraversalReader,
  ) {}

  async traverse(
    graphId: string,
    startNodeId: string,
    options: {
      readonly maximumDepth: number;
      readonly direction:
        GraphTraversalDirection;
      readonly relationshipTypes?:
        readonly string[];
      readonly decayPerDepth: number;
      readonly minimumScore: number;
    },
  ): Promise<readonly GraphTraversalVisit[]> {
    const queue:
      GraphTraversalVisit[] = [{
        nodeId:
          startNodeId,
        depth:
          0,
        accumulatedWeight:
          1,
      }];

    const best =
      new Map<
        string,
        GraphTraversalVisit
      >();

    while (queue.length > 0) {
      queue.sort(
        (a, b) =>
          b.accumulatedWeight -
          a.accumulatedWeight,
      );

      const current =
        queue.shift()!;

      const existing =
        best.get(
          current.nodeId,
        );

      if (
        existing &&
        existing.accumulatedWeight >=
          current.accumulatedWeight
      ) {
        continue;
      }

      best.set(
        current.nodeId,
        current,
      );

      if (
        current.depth >=
        options.maximumDepth
      ) {
        continue;
      }

      const neighbors =
        await this.reader.neighbors(
          graphId,
          current.nodeId,
          options.direction,
          options.relationshipTypes,
        );

      for (const neighbor of neighbors) {
        const score =
          current.accumulatedWeight *
          neighbor.weight *
          options.decayPerDepth;

        if (
          score <
          options.minimumScore
        ) {
          continue;
        }

        queue.push({
          nodeId:
            neighbor.nodeId,
          depth:
            current.depth + 1,
          parentNodeId:
            current.nodeId,
          viaEdgeId:
            neighbor.edgeId,
          viaRelationshipType:
            neighbor.relationshipType,
          accumulatedWeight:
            score,
        });
      }
    }

    return [
      ...best.values(),
    ].sort(
      (a, b) =>
        b.accumulatedWeight -
          a.accumulatedWeight ||
        a.depth - b.depth ||
        a.nodeId.localeCompare(
          b.nodeId,
        ),
    );
  }
}
