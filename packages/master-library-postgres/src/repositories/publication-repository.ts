import type {
  KnowledgeObjectId,
  PublicationId,
} from "@knowledgeos/domain-types";
import type {
  MasterPublication,
  MasterPublicationRepository,
} from "@knowledgeos/master-library";
import type {
  SqlExecutor,
  SqlRow,
} from "@knowledgeos/infrastructure-postgres";
import { publicationFromRow } from "../row-mappers.js";

export class PostgresMasterPublicationRepository
implements MasterPublicationRepository {
  public constructor(private readonly sql: SqlExecutor) {}

  async getById(
    id: PublicationId,
  ): Promise<MasterPublication | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select publication_id,
               knowledge_object_id,
               title,
               authors,
               status,
               current_version_id,
               source_item_ids,
               metadata
        from master_publications
        where publication_id = $1
      `,
      [id],
    );
    const row = result.rows[0];
    return row ? publicationFromRow(row) : undefined;
  }

  async getByKnowledgeObjectId(
    id: KnowledgeObjectId,
  ): Promise<MasterPublication | undefined> {
    const result = await this.sql.query<SqlRow>(
      `
        select publication_id,
               knowledge_object_id,
               title,
               authors,
               status,
               current_version_id,
               source_item_ids,
               metadata
        from master_publications
        where knowledge_object_id = $1
      `,
      [id],
    );
    const row = result.rows[0];
    return row ? publicationFromRow(row) : undefined;
  }

  async save(value: MasterPublication): Promise<void> {
    await this.sql.query(
      `
        insert into master_publications (
          publication_id,
          knowledge_object_id,
          title,
          authors,
          status,
          current_version_id,
          source_item_ids,
          metadata
        ) values (
          $1, $2, $3, $4::jsonb, $5, $6, $7::jsonb, $8::jsonb
        )
        on conflict (publication_id)
        do update set
          knowledge_object_id = excluded.knowledge_object_id,
          title = excluded.title,
          authors = excluded.authors,
          status = excluded.status,
          current_version_id = excluded.current_version_id,
          source_item_ids = excluded.source_item_ids,
          metadata = excluded.metadata,
          updated_at = now()
      `,
      [
        value.publicationId,
        value.knowledgeObjectId,
        value.title,
        JSON.stringify(value.authors),
        value.status,
        value.currentVersionId ?? null,
        JSON.stringify(value.sourceItemIds),
        JSON.stringify(value.metadata),
      ],
    );
  }
}
