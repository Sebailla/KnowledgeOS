import type {
  KnowledgeGraphTraversalReader,
} from "./contracts.js";
import type {
  GraphTraversalOptions,
  GraphTraversalVisit,
} from "./model.js";

export class DepthFirstTraversal {
  public constructor(
    private readonly reader:
      KnowledgeGraphTraversalReader,
  ) {}

  async traverse(
    graphId: string,
    startNodeId: string,
    options: GraphTraversalOptions,
  ): Promise<readonly GraphTraversalVisit[]> {
    if (
      !Number.isInteger(
        options.maximumDepth,
      ) ||
      options.maximumDepth < 0 ||
      options.maximumDepth > 64
    ) {
      throw new Error(
        "maximumDepth must be between 0 and 64",
      );
    }

    const stack:
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

    while (stack.length > 0) {
      const current =
        stack.pop()!;

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

      for (
        let index =
          neighbors.length - 1;
        index >= 0;
        index -= 1
      ) {
        const neighbor =
          neighbors[index]!;

        if (
          visited.has(
            neighbor.nodeId,
          )
        ) {
          continue;
        }

        stack.push({
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
