import type {
  SearchGraphRepository,
} from "@knowledgeos/search-graph";
import type {
  SearchGraphEdge,
  SearchGraphNode,
  SearchGraphRelationshipType,
} from "@knowledgeos/search-graph";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

function nodeFromRow(
  row: SqliteRow,
): SearchGraphNode {
  return {
    nodeId:
      String(row.node_id),
    ...(row.search_document_id == null
      ? {}
      : {
          searchDocumentId:
            String(
              row.search_document_id,
            ),
        }),
    kind:
      String(row.kind),
    label:
      String(row.label),
    metadata:
      JSON.parse(
        String(row.metadata_json),
      ),
  };
}

function edgeFromRow(
  row: SqliteRow,
): SearchGraphEdge {
  return {
    edgeId:
      String(row.edge_id),
    fromNodeId:
      String(row.from_node_id),
    toNodeId:
      String(row.to_node_id),
    type:
      row.relationship_type as SearchGraphEdge["type"],
    weight:
      Number(row.weight),
    directed:
      Boolean(row.directed),
    metadata:
      JSON.parse(
        String(row.metadata_json),
      ),
  };
}

export class SqliteSearchGraphRepository
implements SearchGraphRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async upsertNode(
    node: SearchGraphNode,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_graph_nodes (
          node_id,
          search_document_id,
          kind,
          label,
          metadata_json
        ) values (?, ?, ?, ?, ?)
        on conflict(node_id)
        do update set
          search_document_id = excluded.search_document_id,
          kind = excluded.kind,
          label = excluded.label,
          metadata_json = excluded.metadata_json
      `,
      [
        node.nodeId,
        node.searchDocumentId ?? null,
        node.kind,
        node.label,
        JSON.stringify(node.metadata),
      ],
    );
  }

  async upsertEdge(
    edge: SearchGraphEdge,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_graph_edges (
          edge_id,
          from_node_id,
          to_node_id,
          relationship_type,
          weight,
          directed,
          metadata_json
        ) values (?, ?, ?, ?, ?, ?, ?)
        on conflict(edge_id)
        do update set
          from_node_id = excluded.from_node_id,
          to_node_id = excluded.to_node_id,
          relationship_type = excluded.relationship_type,
          weight = excluded.weight,
          directed = excluded.directed,
          metadata_json = excluded.metadata_json
      `,
      [
        edge.edgeId,
        edge.fromNodeId,
        edge.toNodeId,
        edge.type,
        edge.weight,
        edge.directed ? 1 : 0,
        JSON.stringify(edge.metadata),
      ],
    );
  }

  async getNode(
    nodeId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_graph_nodes
          where node_id = ?
        `,
        [nodeId],
      );

    const row =
      result.rows[0];

    return row
      ? nodeFromRow(row)
      : undefined;
  }

  async neighbors(
    nodeId: string,
    relationshipTypes?:
      readonly SearchGraphRelationshipType[],
  ) {
    const typePredicate =
      relationshipTypes &&
      relationshipTypes.length > 0
        ? `and e.relationship_type in (${relationshipTypes.map(() => "?").join(", ")})`
        : "";

    const result =
      await this.sql.execute<SqliteRow>(
        `
          select
            n.node_id,
            n.search_document_id,
            n.kind,
            n.label,
            n.metadata_json,
            e.edge_id,
            e.from_node_id,
            e.to_node_id,
            e.relationship_type,
            e.weight,
            e.directed,
            e.metadata_json as edge_metadata_json
          from search_graph_edges e
          join search_graph_nodes n
            on n.node_id = case
              when e.from_node_id = ?
              then e.to_node_id
              else e.from_node_id
            end
          where (
            e.from_node_id = ?
            or (
              e.directed = 0
              and e.to_node_id = ?
            )
          )
          ${typePredicate}
        `,
        [
          nodeId,
          nodeId,
          nodeId,
          ...(relationshipTypes ?? []),
        ],
      );

    return result.rows.map(
      (row) => ({
        node:
          nodeFromRow(row),
        edge:
          edgeFromRow({
            ...row,
            metadata_json:
              row.edge_metadata_json,
          }),
      }),
    );
  }

  async allNodes() {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_graph_nodes
          order by node_id asc
        `,
      );

    return result.rows.map(
      nodeFromRow,
    );
  }

  async allEdges() {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_graph_edges
          order by edge_id asc
        `,
      );

    return result.rows.map(
      edgeFromRow,
    );
  }
}

export const searchGraphSqliteMigrations = [
  {
    id:
      "0009_search_graph",
    sql: `
      create table if not exists search_graph_nodes (
        node_id text primary key,
        search_document_id text,
        kind text not null,
        label text not null,
        metadata_json text not null
      );

      create index if not exists idx_search_graph_nodes_document
        on search_graph_nodes(search_document_id);

      create table if not exists search_graph_edges (
        edge_id text primary key,
        from_node_id text not null,
        to_node_id text not null,
        relationship_type text not null,
        weight real not null,
        directed integer not null,
        metadata_json text not null,
        foreign key(from_node_id)
          references search_graph_nodes(node_id)
          on delete cascade,
        foreign key(to_node_id)
          references search_graph_nodes(node_id)
          on delete cascade
      );

      create index if not exists idx_search_graph_edges_from
        on search_graph_edges(
          from_node_id,
          relationship_type
        );

      create index if not exists idx_search_graph_edges_to
        on search_graph_edges(
          to_node_id,
          relationship_type
        );
    `,
  },
] as const;
