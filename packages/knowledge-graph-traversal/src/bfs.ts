import type {
  KnowledgeGraphTraversalReader,
} from "./contracts.js";
import type {
  GraphTraversalOptions,
  GraphTraversalVisit,
} from "./model.js";

export class BreadthFirstTraversal {
  public constructor(
    private readonly reader:
      KnowledgeGraphTraversalReader,
  ) {}

  async traverse(
    graphId: string,
    startNodeId: string,
    options: GraphTraversalOptions,
  ): Promise<readonly GraphTraversalVisit[]> {
    validateDepth(options.maximumDepth);

    const queue:
      GraphTraversalVisit[] = [{
        nodeId:
          startNodeId,
        depth:
          0,
        accumulatedWeight:
          1,
      }];

    const visited =
      new Set<string>();
    const result:
      GraphTraversalVisit[] = [];

    while (queue.length > 0) {
      const current =
        queue.shift()!;

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

      if (
        options.includeStart ||
        current.depth > 0
      ) {
        result.push(current);
      }

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
          options.minimumEdgeWeight,
        );

      for (const neighbor of neighbors) {
        if (
          visited.has(
            neighbor.nodeId,
          )
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
            current.accumulatedWeight *
            neighbor.weight,
        });
      }
    }

    return result;
  }
}

function validateDepth(
  maximumDepth: number,
): void {
  if (
    !Number.isInteger(
      maximumDepth,
    ) ||
    maximumDepth < 0 ||
    maximumDepth > 64
  ) {
    throw new Error(
      "maximumDepth must be between 0 and 64",
    );
  }
}
