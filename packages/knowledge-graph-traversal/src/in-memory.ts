import type {
  KnowledgeGraphTraversalReader,
} from "./contracts.js";
import type {
  GraphNeighbor,
  GraphTraversalDirection,
} from "./model.js";

export class InMemoryKnowledgeGraphTraversalReader
implements KnowledgeGraphTraversalReader {
  private readonly values =
    new Map<string, GraphNeighbor[]>();

  seed(
    graphId: string,
    nodeId: string,
    neighbors:
      readonly GraphNeighbor[],
  ): void {
    this.values.set(
      `${graphId}::${nodeId}`,
      [...neighbors],
    );
  }

  async neighbors(
    graphId: string,
    nodeId: string,
    direction:
      GraphTraversalDirection,
    relationshipTypes?:
      readonly string[],
    minimumEdgeWeight?:
      number,
  ) {
    return (
      this.values.get(
        `${graphId}::${nodeId}`,
      ) ?? []
    ).filter(
      (value) =>
        (
          direction === "both" ||
          value.direction === direction
        ) &&
        (
          !relationshipTypes ||
          relationshipTypes.includes(
            value.relationshipType,
          )
        ) &&
        (
          minimumEdgeWeight ===
            undefined ||
          value.weight >=
            minimumEdgeWeight
        ),
    );
  }
}
