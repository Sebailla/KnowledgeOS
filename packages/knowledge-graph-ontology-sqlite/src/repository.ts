import type {
  KnowledgeGraphOntologyRepository,
  OntologyNodeType,
  OntologyRelationshipType,
  OntologyTaxonomyTerm,
} from "@knowledgeos/knowledge-graph-ontology";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteKnowledgeGraphOntologyRepository
implements KnowledgeGraphOntologyRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async getNodeType(
    ontologyId: string,
    typeId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_ontology_node_types
          where ontology_id = ?
            and type_id = ?
        `,
        [ontologyId, typeId],
      );

    const row = result.rows[0];
    return row
      ? nodeTypeFromRow(row)
      : undefined;
  }

  async saveNodeType(
    ontologyId: string,
    type: OntologyNodeType,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into knowledge_graph_ontology_node_types (
          ontology_id,
          type_id,
          label,
          description,
          abstract,
          parent_type_ids_json,
          properties_json,
          version,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(ontology_id, type_id)
        do update set
          label = excluded.label,
          description = excluded.description,
          abstract = excluded.abstract,
          parent_type_ids_json = excluded.parent_type_ids_json,
          properties_json = excluded.properties_json,
          version = excluded.version,
          updated_at = excluded.updated_at
      `,
      [
        ontologyId,
        type.typeId,
        type.label,
        type.description ?? null,
        type.abstract ? 1 : 0,
        JSON.stringify(type.parentTypeIds),
        JSON.stringify(type.properties),
        type.version,
        type.createdAt,
        type.updatedAt,
      ],
    );
  }

  async listNodeTypes(
    ontologyId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_ontology_node_types
          where ontology_id = ?
          order by type_id asc
        `,
        [ontologyId],
      );

    return result.rows.map(
      nodeTypeFromRow,
    );
  }

  async getRelationshipType(
    ontologyId: string,
    relationshipTypeId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_ontology_relationship_types
          where ontology_id = ?
            and relationship_type_id = ?
        `,
        [
          ontologyId,
          relationshipTypeId,
        ],
      );

    const row = result.rows[0];
    return row
      ? relationshipTypeFromRow(
          row,
        )
      : undefined;
  }

  async saveRelationshipType(
    ontologyId: string,
    type: OntologyRelationshipType,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into knowledge_graph_ontology_relationship_types (
          ontology_id,
          relationship_type_id,
          label,
          description,
          directed,
          symmetric,
          transitive,
          inverse_relationship_type_id,
          allowed_from_type_ids_json,
          allowed_to_type_ids_json,
          version,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(ontology_id, relationship_type_id)
        do update set
          label = excluded.label,
          description = excluded.description,
          directed = excluded.directed,
          symmetric = excluded.symmetric,
          transitive = excluded.transitive,
          inverse_relationship_type_id = excluded.inverse_relationship_type_id,
          allowed_from_type_ids_json = excluded.allowed_from_type_ids_json,
          allowed_to_type_ids_json = excluded.allowed_to_type_ids_json,
          version = excluded.version,
          updated_at = excluded.updated_at
      `,
      [
        ontologyId,
        type.relationshipTypeId,
        type.label,
        type.description ?? null,
        type.directed ? 1 : 0,
        type.symmetric ? 1 : 0,
        type.transitive ? 1 : 0,
        type.inverseRelationshipTypeId ?? null,
        JSON.stringify(
          type.allowedFromTypeIds,
        ),
        JSON.stringify(
          type.allowedToTypeIds,
        ),
        type.version,
        type.createdAt,
        type.updatedAt,
      ],
    );
  }

  async listRelationshipTypes(
    ontologyId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_ontology_relationship_types
          where ontology_id = ?
          order by relationship_type_id asc
        `,
        [ontologyId],
      );

    return result.rows.map(
      relationshipTypeFromRow,
    );
  }

  async saveTaxonomyTerm(
    ontologyId: string,
    term: OntologyTaxonomyTerm,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into knowledge_graph_ontology_taxonomy_terms (
          ontology_id,
          taxonomy_id,
          term_id,
          label,
          parent_term_id,
          synonyms_json,
          metadata_json
        ) values (?, ?, ?, ?, ?, ?, ?)
        on conflict(ontology_id, taxonomy_id, term_id)
        do update set
          label = excluded.label,
          parent_term_id = excluded.parent_term_id,
          synonyms_json = excluded.synonyms_json,
          metadata_json = excluded.metadata_json
      `,
      [
        ontologyId,
        term.taxonomyId,
        term.termId,
        term.label,
        term.parentTermId ?? null,
        JSON.stringify(term.synonyms),
        JSON.stringify(term.metadata),
      ],
    );
  }

  async listTaxonomyTerms(
    ontologyId: string,
    taxonomyId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from knowledge_graph_ontology_taxonomy_terms
          where ontology_id = ?
            and taxonomy_id = ?
          order by term_id asc
        `,
        [ontologyId, taxonomyId],
      );

    return result.rows.map(
      taxonomyTermFromRow,
    );
  }
}

function nodeTypeFromRow(
  row: SqliteRow,
): OntologyNodeType {
  return {
    typeId:
      String(row.type_id),
    label:
      String(row.label),
    ...(row.description == null
      ? {}
      : {
          description:
            String(row.description),
        }),
    abstract:
      Boolean(row.abstract),
    parentTypeIds:
      JSON.parse(
        String(
          row.parent_type_ids_json,
        ),
      ),
    properties:
      JSON.parse(
        String(row.properties_json),
      ),
    version:
      Number(row.version),
    createdAt:
      String(row.created_at),
    updatedAt:
      String(row.updated_at),
  };
}

function relationshipTypeFromRow(
  row: SqliteRow,
): OntologyRelationshipType {
  return {
    relationshipTypeId:
      String(
        row.relationship_type_id,
      ),
    label:
      String(row.label),
    ...(row.description == null
      ? {}
      : {
          description:
            String(row.description),
        }),
    directed:
      Boolean(row.directed),
    symmetric:
      Boolean(row.symmetric),
    transitive:
      Boolean(row.transitive),
    ...(row.inverse_relationship_type_id ==
    null
      ? {}
      : {
          inverseRelationshipTypeId:
            String(
              row.inverse_relationship_type_id,
            ),
        }),
    allowedFromTypeIds:
      JSON.parse(
        String(
          row.allowed_from_type_ids_json,
        ),
      ),
    allowedToTypeIds:
      JSON.parse(
        String(
          row.allowed_to_type_ids_json,
        ),
      ),
    version:
      Number(row.version),
    createdAt:
      String(row.created_at),
    updatedAt:
      String(row.updated_at),
  };
}

function taxonomyTermFromRow(
  row: SqliteRow,
): OntologyTaxonomyTerm {
  return {
    taxonomyId:
      String(row.taxonomy_id),
    termId:
      String(row.term_id),
    label:
      String(row.label),
    ...(row.parent_term_id == null
      ? {}
      : {
          parentTermId:
            String(
              row.parent_term_id,
            ),
        }),
    synonyms:
      JSON.parse(
        String(row.synonyms_json),
      ),
    metadata:
      JSON.parse(
        String(row.metadata_json),
      ),
  };
}

export const knowledgeGraphOntologySqliteMigrations = [
  {
    id:
      "0012_knowledge_graph_ontology",
    sql: `
      create table if not exists knowledge_graph_ontology_node_types (
        ontology_id text not null,
        type_id text not null,
        label text not null,
        description text,
        abstract integer not null,
        parent_type_ids_json text not null,
        properties_json text not null,
        version integer not null,
        created_at text not null,
        updated_at text not null,
        primary key(ontology_id, type_id)
      );

      create table if not exists knowledge_graph_ontology_relationship_types (
        ontology_id text not null,
        relationship_type_id text not null,
        label text not null,
        description text,
        directed integer not null,
        symmetric integer not null,
        transitive integer not null,
        inverse_relationship_type_id text,
        allowed_from_type_ids_json text not null,
        allowed_to_type_ids_json text not null,
        version integer not null,
        created_at text not null,
        updated_at text not null,
        primary key(ontology_id, relationship_type_id)
      );

      create table if not exists knowledge_graph_ontology_taxonomy_terms (
        ontology_id text not null,
        taxonomy_id text not null,
        term_id text not null,
        label text not null,
        parent_term_id text,
        synonyms_json text not null,
        metadata_json text not null,
        primary key(ontology_id, taxonomy_id, term_id)
      );

      create index if not exists idx_kg_ontology_taxonomy_parent
        on knowledge_graph_ontology_taxonomy_terms(
          ontology_id,
          taxonomy_id,
          parent_term_id
        );
    `,
  },
] as const;
