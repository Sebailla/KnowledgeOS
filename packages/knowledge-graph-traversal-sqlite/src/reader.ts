import type {
  KnowledgeGraphTraversalReader,
} from "@knowledgeos/knowledge-graph-traversal";
import type {
  GraphNeighbor,
  GraphTraversalDirection,
} from "@knowledgeos/knowledge-graph-traversal";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteKnowledgeGraphTraversalReader
implements KnowledgeGraphTraversalReader {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async neighbors(
    graphId: string,
    nodeId: string,
    direction:
      GraphTraversalDirection,
    relationshipTypes?:
      readonly string[],
    minimumEdgeWeight?:
      number,
  ): Promise<
    readonly GraphNeighbor[]
  > {
    const predicates = [
      "graph_id = ?",
      "deleted_at is null",
    ];
    const parameters:
      unknown[] = [
        graphId,
      ];

    if (
      direction ===
      "outgoing"
    ) {
      predicates.push(
        "from_node_id = ?",
      );
      parameters.push(nodeId);
    } else if (
      direction ===
      "incoming"
    ) {
      predicates.push(
        "to_node_id = ?",
      );
      parameters.push(nodeId);
    } else {
      predicates.push(
        "(from_node_id = ? or to_node_id = ?)",
      );
      parameters.push(
        nodeId,
        nodeId,
      );
    }

    if (
      relationshipTypes &&
      relationshipTypes.length > 0
    ) {
      predicates.push(
        `type in (${relationshipTypes
          .map(() => "?")
          .join(", ")})`,
      );
      parameters.push(
        ...relationshipTypes,
      );
    }

    if (
      minimumEdgeWeight !==
      undefined
    ) {
      predicates.push(
        "weight >= ?",
      );
      parameters.push(
        minimumEdgeWeight,
      );
    }

    const result =
      await this.sql.execute<SqliteRow>(
        `
          select
            edge_id,
            from_node_id,
            to_node_id,
            type,
            weight,
            directed
          from knowledge_graph_edges
          where ${predicates.join(" and ")}
          order by edge_id asc
        `,
        parameters,
      );

    const neighbors:
      GraphNeighbor[] = [];

    for (const row of result.rows) {
      const fromNodeId =
        String(row.from_node_id);
      const toNodeId =
        String(row.to_node_id);
      const directed =
        Boolean(row.directed);

      if (
        fromNodeId === nodeId
      ) {
        neighbors.push({
          nodeId:
            toNodeId,
          edgeId:
            String(row.edge_id),
          relationshipType:
            String(
              row.type,
            ),
          weight:
            Number(row.weight),
          direction:
            "outgoing",
        });
      }

      if (
        toNodeId === nodeId &&
        (
          direction !==
            "outgoing" ||
          !directed
        )
      ) {
        neighbors.push({
          nodeId:
            fromNodeId,
          edgeId:
            String(row.edge_id),
          relationshipType:
            String(
              row.type,
            ),
          weight:
            Number(row.weight),
          direction:
            "incoming",
        });
      }
    }

    return neighbors;
  }
}
