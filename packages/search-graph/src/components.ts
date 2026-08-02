import type {
  SearchGraphRepository,
} from "./contracts.js";

export class SearchGraphConnectedComponentsService {
  public constructor(
    private readonly graph:
      SearchGraphRepository,
  ) {}

  async calculate(): Promise<
    readonly (readonly string[])[]
  > {
    const nodes =
      await this.graph.allNodes();
    const visited =
      new Set<string>();
    const components:
      string[][] = [];

    for (const node of nodes) {
      if (
        visited.has(
          node.nodeId,
        )
      ) {
        continue;
      }

      const component:
        string[] = [];
      const queue = [
        node.nodeId,
      ];

      while (
        queue.length > 0
      ) {
        const nodeId =
          queue.shift()!;

        if (
          visited.has(
            nodeId,
          )
        ) {
          continue;
        }

        visited.add(nodeId);
        component.push(nodeId);

        const neighbors =
          await this.graph.neighbors(
            nodeId,
          );

        for (const neighbor of neighbors) {
          if (
            !visited.has(
              neighbor.node.nodeId,
            )
          ) {
            queue.push(
              neighbor.node.nodeId,
            );
          }
        }
      }

      components.push(
        component.sort(),
      );
    }

    return components.sort(
      (a, b) =>
        b.length - a.length ||
        a[0]!.localeCompare(
          b[0]!,
        ),
    );
  }
}
