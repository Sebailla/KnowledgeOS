import type {
  SearchGraphRepository,
} from "./contracts.js";

export interface SearchGraphCentrality {
  readonly nodeId: string;
  readonly degree: number;
  readonly weightedDegree: number;
}

export class SearchGraphCentralityService {
  public constructor(
    private readonly graph:
      SearchGraphRepository,
  ) {}

  async calculate(): Promise<
    readonly SearchGraphCentrality[]
  > {
    const nodes =
      await this.graph.allNodes();
    const edges =
      await this.graph.allEdges();

    return nodes.map(
      (node) => {
        const related =
          edges.filter(
            (edge) =>
              edge.fromNodeId ===
                node.nodeId ||
              edge.toNodeId ===
                node.nodeId,
          );

        return {
          nodeId:
            node.nodeId,
          degree:
            related.length,
          weightedDegree:
            related.reduce(
              (sum, edge) =>
                sum + edge.weight,
              0,
            ),
        };
      },
    ).sort(
      (a, b) =>
        b.weightedDegree -
          a.weightedDegree ||
        b.degree - a.degree ||
        a.nodeId.localeCompare(
          b.nodeId,
        ),
    );
  }
}
