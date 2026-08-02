import type {
  SearchGraphRelationshipType,
  SearchGraphTraversalStep,
} from "./model.js";
import type {
  SearchGraphRepository,
} from "./contracts.js";

export interface SearchGraphTraversalOptions {
  readonly maximumDepth: number;
  readonly relationshipTypes?:
    readonly SearchGraphRelationshipType[];
  readonly minimumScore: number;
  readonly decayPerDepth: number;
}

export class SearchGraphTraversalService {
  public constructor(
    private readonly graph:
      SearchGraphRepository,
  ) {}

  async traverse(
    startNodeIds:
      readonly string[],
    options:
      SearchGraphTraversalOptions,
  ): Promise<
    readonly SearchGraphTraversalStep[]
  > {
    if (
      !Number.isInteger(
        options.maximumDepth,
      ) ||
      options.maximumDepth < 0 ||
      options.maximumDepth > 10
    ) {
      throw new Error(
        "maximumDepth must be between 0 and 10",
      );
    }

    const queue:
      SearchGraphTraversalStep[] =
      startNodeIds.map(
        (nodeId) => ({
          nodeId,
          depth: 0,
          score: 1,
        }),
      );

    const best =
      new Map<
        string,
        SearchGraphTraversalStep
      >();

    while (queue.length > 0) {
      const current =
        queue.shift()!;

      const existing =
        best.get(current.nodeId);

      if (
        existing &&
        existing.score >=
          current.score
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
        await this.graph.neighbors(
          current.nodeId,
          options.relationshipTypes,
        );

      for (const neighbor of neighbors) {
        const score =
          current.score *
          neighbor.edge.weight *
          options.decayPerDepth;

        if (
          score <
          options.minimumScore
        ) {
          continue;
        }

        queue.push({
          nodeId:
            neighbor.node.nodeId,
          depth:
            current.depth + 1,
          score,
          viaEdgeId:
            neighbor.edge.edgeId,
          viaRelationship:
            neighbor.edge.type,
          parentNodeId:
            current.nodeId,
        });
      }
    }

    return [
      ...best.values(),
    ].sort(
      (a, b) =>
        b.score - a.score ||
        a.depth - b.depth ||
        a.nodeId.localeCompare(
          b.nodeId,
        ),
    );
  }
}
