import type {
  AiConversation,
  AiConversationRepository,
  AiConversationSummary,
  AiConversationSummaryRepository,
} from "@knowledgeos/ai-memory";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteAiConversationRepository
implements AiConversationRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async get(
    ownerId: string,
    conversationId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from ai_conversations
          where owner_id = ?
            and conversation_id = ?
        `,
        [ownerId, conversationId],
      );

    const row =
      result.rows[0];

    return row
      ? fromConversationRow(row)
      : undefined;
  }

  async save(
    conversation: AiConversation,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into ai_conversations (
          conversation_id,
          owner_id,
          title,
          messages_json,
          created_at,
          updated_at,
          archived_at
        ) values (?, ?, ?, ?, ?, ?, ?)
        on conflict(conversation_id)
        do update set
          owner_id = excluded.owner_id,
          title = excluded.title,
          messages_json = excluded.messages_json,
          updated_at = excluded.updated_at,
          archived_at = excluded.archived_at
      `,
      [
        conversation.conversationId,
        conversation.ownerId,
        conversation.title,
        JSON.stringify(
          conversation.messages,
        ),
        conversation.createdAt,
        conversation.updatedAt,
        conversation.archivedAt ?? null,
      ],
    );
  }

  async list(
    ownerId: string,
    limit: number,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from ai_conversations
          where owner_id = ?
          order by updated_at desc
          limit ?
        `,
        [ownerId, limit],
      );

    return result.rows.map(
      fromConversationRow,
    );
  }
}

export class SqliteAiConversationSummaryRepository
implements AiConversationSummaryRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async getLatest(
    conversationId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from ai_conversation_summaries
          where conversation_id = ?
          order by created_at desc
          limit 1
        `,
        [conversationId],
      );

    const row =
      result.rows[0];

    return row
      ? {
          conversationId:
            String(
              row.conversation_id,
            ),
          summary:
            String(row.summary),
          sourceMessageIds:
            JSON.parse(
              String(
                row.source_message_ids_json,
              ),
            ),
          createdAt:
            String(row.created_at),
        }
      : undefined;
  }

  async save(
    summary:
      AiConversationSummary,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into ai_conversation_summaries (
          conversation_id,
          summary,
          source_message_ids_json,
          created_at
        ) values (?, ?, ?, ?)
      `,
      [
        summary.conversationId,
        summary.summary,
        JSON.stringify(
          summary.sourceMessageIds,
        ),
        summary.createdAt,
      ],
    );
  }
}

function fromConversationRow(
  row: SqliteRow,
): AiConversation {
  return {
    conversationId:
      String(row.conversation_id),
    ownerId:
      String(row.owner_id),
    title:
      String(row.title),
    messages:
      JSON.parse(
        String(row.messages_json),
      ),
    createdAt:
      String(row.created_at),
    updatedAt:
      String(row.updated_at),
    ...(row.archived_at == null
      ? {}
      : {
          archivedAt:
            String(row.archived_at),
        }),
  };
}

export const aiMemorySqliteMigrations = [
  {
    id: "0014_ai_memory",
    sql: `
      create table if not exists ai_conversations (
        conversation_id text primary key,
        owner_id text not null,
        title text not null,
        messages_json text not null,
        created_at text not null,
        updated_at text not null,
        archived_at text
      );

      create index if not exists idx_ai_conversations_owner
        on ai_conversations(
          owner_id,
          updated_at
        );

      create table if not exists ai_conversation_summaries (
        conversation_id text not null,
        summary text not null,
        source_message_ids_json text not null,
        created_at text not null,
        primary key(
          conversation_id,
          created_at
        )
      );
    `,
  },
] as const;
