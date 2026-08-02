import type {
  KnowledgeObjectId,
} from "@knowledgeos/domain-types";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";
import type {
  PersonalKnowledgeItem,
  PersonalKnowledgeRepository,
  PersonalKnowledgeRevision,
  PersonalKnowledgeRevisionRepository,
} from "@knowledgeos/personal-knowledge";

function itemFromRow(
  row: SqliteRow,
): PersonalKnowledgeItem {
  const anchor =
    row.anchor_json == null
      ? undefined
      : JSON.parse(
          String(row.anchor_json),
        );

  return {
    itemId: String(row.item_id),
    ownerId: String(row.owner_id),
    knowledgeObjectId:
      row.knowledge_object_id as KnowledgeObjectId,
    type:
      row.item_type as PersonalKnowledgeItem["type"],
    ...(anchor ? { anchor } : {}),
    body: String(row.body),
    tags:
      JSON.parse(
        String(row.tags_json),
      ),
    ...(row.color == null
      ? {}
      : { color: String(row.color) }),
    revision: Number(row.revision),
    deleted: Boolean(row.deleted),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class SqlitePersonalKnowledgeRepository
implements PersonalKnowledgeRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async get(
    itemId: string,
  ): Promise<PersonalKnowledgeItem | undefined> {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from personal_knowledge_items
          where item_id = ?
        `,
        [itemId],
      );

    const row = result.rows[0];
    return row ? itemFromRow(row) : undefined;
  }

  async save(
    item: PersonalKnowledgeItem,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into personal_knowledge_items (
          item_id,
          owner_id,
          knowledge_object_id,
          item_type,
          anchor_json,
          body,
          tags_json,
          color,
          revision,
          deleted,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(item_id)
        do update set
          owner_id = excluded.owner_id,
          knowledge_object_id = excluded.knowledge_object_id,
          item_type = excluded.item_type,
          anchor_json = excluded.anchor_json,
          body = excluded.body,
          tags_json = excluded.tags_json,
          color = excluded.color,
          revision = excluded.revision,
          deleted = excluded.deleted,
          updated_at = excluded.updated_at
      `,
      [
        item.itemId,
        item.ownerId,
        item.knowledgeObjectId,
        item.type,
        item.anchor
          ? JSON.stringify(item.anchor)
          : null,
        item.body,
        JSON.stringify(item.tags),
        item.color ?? null,
        item.revision,
        item.deleted ? 1 : 0,
        item.createdAt,
        item.updatedAt,
      ],
    );
  }

  async listByKnowledgeObject(
    knowledgeObjectId: string,
    includeDeleted = false,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from personal_knowledge_items
          where knowledge_object_id = ?
            and (? = 1 or deleted = 0)
          order by created_at asc
        `,
        [
          knowledgeObjectId,
          includeDeleted ? 1 : 0,
        ],
      );

    return result.rows.map(itemFromRow);
  }
}

export class SqlitePersonalKnowledgeRevisionRepository
implements PersonalKnowledgeRevisionRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async append(
    revision: PersonalKnowledgeRevision,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into personal_knowledge_revisions (
          item_id,
          revision,
          snapshot_json,
          changed_at,
          changed_by
        ) values (?, ?, ?, ?, ?)
      `,
      [
        revision.itemId,
        revision.revision,
        JSON.stringify(
          revision.snapshot,
        ),
        revision.changedAt,
        revision.changedBy,
      ],
    );
  }

  async list(
    itemId: string,
  ): Promise<readonly PersonalKnowledgeRevision[]> {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from personal_knowledge_revisions
          where item_id = ?
          order by revision asc
        `,
        [itemId],
      );

    return result.rows.map(
      (row) => ({
        itemId:
          String(row.item_id),
        revision:
          Number(row.revision),
        snapshot:
          JSON.parse(
            String(row.snapshot_json),
          ),
        changedAt:
          String(row.changed_at),
        changedBy:
          String(row.changed_by),
      }),
    );
  }
}

export const personalKnowledgeMigrations = [
  {
    id: "0003_personal_knowledge",
    sql: `
      create table if not exists personal_knowledge_items (
        item_id text primary key,
        owner_id text not null,
        knowledge_object_id text not null,
        item_type text not null,
        anchor_json text,
        body text not null,
        tags_json text not null,
        color text,
        revision integer not null check (revision >= 1),
        deleted integer not null,
        created_at text not null,
        updated_at text not null
      );

      create index if not exists idx_personal_knowledge_object
        on personal_knowledge_items(
          knowledge_object_id,
          deleted,
          created_at
        );

      create table if not exists personal_knowledge_revisions (
        item_id text not null
          references personal_knowledge_items(item_id)
          on delete cascade,
        revision integer not null,
        snapshot_json text not null,
        changed_at text not null,
        changed_by text not null,
        primary key(item_id, revision)
      );
    `,
  },
] as const;
