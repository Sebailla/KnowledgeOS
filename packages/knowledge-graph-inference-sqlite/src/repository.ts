import type {
  KnowledgeGraphDerivedFact,
  KnowledgeGraphFact,
  KnowledgeGraphInferenceRepository,
  KnowledgeGraphInferenceRule,
} from "@knowledgeos/knowledge-graph-inference";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteKnowledgeGraphInferenceRepository
implements KnowledgeGraphInferenceRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async saveRule(
    rule: KnowledgeGraphInferenceRule,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into knowledge_graph_inference_rules (
          rule_id,
          ontology_id,
          kind,
          source_relationship_type_ids_json,
          target_relationship_type_id,
          enabled,
          priority,
          version,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(rule_id)
        do update set
          ontology_id = excluded.ontology_id,
          kind = excluded.kind,
          source_relationship_type_ids_json =
            excluded.source_relationship_type_ids_json,
          target_relationship_type_id =
            excluded.target_relationship_type_id,
          enabled = excluded.enabled,
          priority = excluded.priority,
          version = excluded.version,
          updated_at = excluded.updated_at
      `,
      [
        rule.ruleId,
        rule.ontologyId,
        rule.kind,
        JSON.stringify(rule.sourceRelationshipTypeIds),
        rule.targetRelationshipTypeId,
        rule.enabled ? 1 : 0,
        rule.priority,
        rule.version,
        rule.createdAt,
        rule.updatedAt,
      ],
    );
  }

  async listRules(ontologyId: string) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_inference_rules
          where ontology_id = ?
          order by priority desc, rule_id asc
        `,
        [ontologyId],
      );

    return result.rows.map(ruleFromRow);
  }

  async listFacts(
    graphId: string,
    relationshipTypeIds?: readonly string[],
  ) {
    const predicate =
      relationshipTypeIds &&
      relationshipTypeIds.length > 0
        ? `and type in (${relationshipTypeIds
            .map(() => "?")
            .join(", ")})`
        : "";

    const result =
      await this.sql.execute<SqliteRow>(
        `
          select
            graph_id,
            edge_id,
            from_node_id,
            to_node_id,
            type,
            weight
          from knowledge_graph_edges
          where graph_id = ?
            and deleted_at is null
            ${predicate}
          order by edge_id asc
        `,
        [
          graphId,
          ...(relationshipTypeIds ?? []),
        ],
      );

    return result.rows.map(
      (row): KnowledgeGraphFact => ({
        graphId: String(row.graph_id),
        edgeId: String(row.edge_id),
        fromNodeId: String(row.from_node_id),
        toNodeId: String(row.to_node_id),
        relationshipTypeId: String(row.type),
        weight: Number(row.weight),
        derived: false,
      }),
    );
  }

  async upsertDerivedFact(
    fact: KnowledgeGraphDerivedFact,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into knowledge_graph_derived_facts (
          graph_id,
          edge_id,
          from_node_id,
          to_node_id,
          relationship_type_id,
          weight,
          rule_id,
          source_edge_ids_json,
          generated_at,
          generation
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(graph_id, edge_id)
        do update set
          from_node_id = excluded.from_node_id,
          to_node_id = excluded.to_node_id,
          relationship_type_id =
            excluded.relationship_type_id,
          weight = excluded.weight,
          rule_id = excluded.rule_id,
          source_edge_ids_json =
            excluded.source_edge_ids_json,
          generated_at = excluded.generated_at,
          generation = excluded.generation
      `,
      [
        fact.graphId,
        fact.edgeId,
        fact.fromNodeId,
        fact.toNodeId,
        fact.relationshipTypeId,
        fact.weight,
        fact.provenance.ruleId,
        JSON.stringify(
          fact.provenance.sourceEdgeIds,
        ),
        fact.provenance.generatedAt,
        fact.provenance.generation,
      ],
    );
  }

  async deleteDerivedFactsByRule(
    graphId: string,
    ruleId: string,
  ): Promise<number> {
    const count =
      await this.sql.execute<SqliteRow>(
        `
          select count(*) as total
          from knowledge_graph_derived_facts
          where graph_id = ?
            and rule_id = ?
        `,
        [graphId, ruleId],
      );

    await this.sql.execute(
      `
        delete from knowledge_graph_derived_facts
        where graph_id = ?
          and rule_id = ?
      `,
      [graphId, ruleId],
    );

    return Number(count.rows[0]?.total ?? 0);
  }

  async listDerivedFacts(graphId: string) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_derived_facts
          where graph_id = ?
          order by edge_id asc
        `,
        [graphId],
      );

    return result.rows.map(derivedFromRow);
  }
}

function ruleFromRow(
  row: SqliteRow,
): KnowledgeGraphInferenceRule {
  return {
    ruleId: String(row.rule_id),
    ontologyId: String(row.ontology_id),
    kind: row.kind as KnowledgeGraphInferenceRule["kind"],
    sourceRelationshipTypeIds:
      JSON.parse(
        String(
          row.source_relationship_type_ids_json,
        ),
      ),
    targetRelationshipTypeId:
      String(row.target_relationship_type_id),
    enabled: Boolean(row.enabled),
    priority: Number(row.priority),
    version: Number(row.version),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function derivedFromRow(
  row: SqliteRow,
): KnowledgeGraphDerivedFact {
  return {
    graphId: String(row.graph_id),
    edgeId: String(row.edge_id),
    fromNodeId: String(row.from_node_id),
    toNodeId: String(row.to_node_id),
    relationshipTypeId:
      String(row.relationship_type_id),
    weight: Number(row.weight),
    derived: true,
    provenance: {
      ruleId: String(row.rule_id),
      sourceEdgeIds:
        JSON.parse(
          String(row.source_edge_ids_json),
        ),
      generatedAt: String(row.generated_at),
      generation: Number(row.generation),
    },
  };
}

export const knowledgeGraphInferenceSqliteMigrations = [
  {
    id: "0013_knowledge_graph_inference",
    sql: `
      create table if not exists knowledge_graph_inference_rules (
        rule_id text primary key,
        ontology_id text not null,
        kind text not null,
        source_relationship_type_ids_json text not null,
        target_relationship_type_id text not null,
        enabled integer not null,
        priority integer not null,
        version integer not null,
        created_at text not null,
        updated_at text not null
      );

      create index if not exists idx_kg_inference_rules_ontology
        on knowledge_graph_inference_rules(
          ontology_id,
          enabled,
          priority
        );

      create table if not exists knowledge_graph_derived_facts (
        graph_id text not null,
        edge_id text not null,
        from_node_id text not null,
        to_node_id text not null,
        relationship_type_id text not null,
        weight real not null,
        rule_id text not null,
        source_edge_ids_json text not null,
        generated_at text not null,
        generation integer not null,
        primary key(graph_id, edge_id)
      );

      create index if not exists idx_kg_derived_rule
        on knowledge_graph_derived_facts(
          graph_id,
          rule_id
        );

      create index if not exists idx_kg_derived_relation
        on knowledge_graph_derived_facts(
          graph_id,
          relationship_type_id,
          from_node_id,
          to_node_id
        );
    `,
  },
] as const;
