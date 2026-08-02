import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";
import type {
  SearchChangeEvent,
  SearchLiveSubscription,
  SearchResultSnapshot,
} from "@knowledgeos/search-live";
import type {
  SearchChangeEventRepository,
  SearchLiveSubscriptionRepository,
  SearchSnapshotRepository,
} from "@knowledgeos/search-live";
import type {
  SavedSearch,
  SearchHistoryEntry,
} from "@knowledgeos/search-saved";
import type {
  SavedSearchRepository,
  SearchHistoryRepository,
} from "@knowledgeos/search-saved";

export class SqliteSavedSearchRepository
implements SavedSearchRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async get(
    ownerId: string,
    savedSearchId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from saved_searches
          where owner_id = ?
            and saved_search_id = ?
        `,
        [ownerId, savedSearchId],
      );

    const row =
      result.rows[0];

    return row
      ? {
          savedSearchId:
            String(row.saved_search_id),
          ownerId:
            String(row.owner_id),
          name:
            String(row.name),
          query:
            String(row.query),
          rankingProfile:
            row.ranking_profile as SavedSearch["rankingProfile"],
          live:
            Boolean(row.live),
          createdAt:
            String(row.created_at),
          updatedAt:
            String(row.updated_at),
          ...(row.last_executed_at == null
            ? {}
            : {
                lastExecutedAt:
                  String(row.last_executed_at),
              }),
        }
      : undefined;
  }

  async save(
    value: SavedSearch,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into saved_searches (
          saved_search_id,
          owner_id,
          name,
          query,
          ranking_profile,
          live,
          created_at,
          updated_at,
          last_executed_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(saved_search_id)
        do update set
          owner_id = excluded.owner_id,
          name = excluded.name,
          query = excluded.query,
          ranking_profile = excluded.ranking_profile,
          live = excluded.live,
          updated_at = excluded.updated_at,
          last_executed_at = excluded.last_executed_at
      `,
      [
        value.savedSearchId,
        value.ownerId,
        value.name,
        value.query,
        value.rankingProfile,
        value.live ? 1 : 0,
        value.createdAt,
        value.updatedAt,
        value.lastExecutedAt ?? null,
      ],
    );
  }

  async list(ownerId: string) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from saved_searches
          where owner_id = ?
          order by updated_at desc
        `,
        [ownerId],
      );

    const values: SavedSearch[] = [];
    for (const row of result.rows) {
      const value =
        await this.get(
          String(row.owner_id),
          String(row.saved_search_id),
        );
      if (value) values.push(value);
    }
    return values;
  }

  async delete(
    ownerId: string,
    savedSearchId: string,
  ): Promise<boolean> {
    const existing =
      await this.get(
        ownerId,
        savedSearchId,
      );

    if (!existing) return false;

    await this.sql.execute(
      `
        delete from saved_searches
        where owner_id = ?
          and saved_search_id = ?
      `,
      [ownerId, savedSearchId],
    );

    return true;
  }
}

export class SqliteSearchHistoryRepository
implements SearchHistoryRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async append(
    entry: SearchHistoryEntry,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_history (
          history_id,
          owner_id,
          query,
          ranking_profile,
          result_count,
          executed_at,
          duration_milliseconds
        ) values (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        entry.historyId,
        entry.ownerId,
        entry.query,
        entry.rankingProfile,
        entry.resultCount,
        entry.executedAt,
        entry.durationMilliseconds,
      ],
    );
  }

  async listRecent(
    ownerId: string,
    limit: number,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_history
          where owner_id = ?
          order by executed_at desc
          limit ?
        `,
        [ownerId, limit],
      );

    return result.rows.map(
      (row) => ({
        historyId:
          String(row.history_id),
        ownerId:
          String(row.owner_id),
        query:
          String(row.query),
        rankingProfile:
          String(row.ranking_profile),
        resultCount:
          Number(row.result_count),
        executedAt:
          String(row.executed_at),
        durationMilliseconds:
          Number(
            row.duration_milliseconds,
          ),
      }),
    );
  }
}

export class SqliteSearchChangeEventRepository
implements SearchChangeEventRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async append(
    event: SearchChangeEvent,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_change_events (
          sequence,
          kind,
          search_document_id,
          knowledge_object_id,
          occurred_at
        ) values (?, ?, ?, ?, ?)
      `,
      [
        event.sequence,
        event.kind,
        event.searchDocumentId ?? null,
        event.knowledgeObjectId ?? null,
        event.occurredAt,
      ],
    );
  }

  async listAfter(
    sequence: number,
    limit: number,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_change_events
          where sequence > ?
          order by sequence asc
          limit ?
        `,
        [sequence, limit],
      );

    return result.rows.map(
      (row) => ({
        sequence:
          Number(row.sequence),
        kind:
          row.kind as SearchChangeEvent["kind"],
        ...(row.search_document_id == null
          ? {}
          : {
              searchDocumentId:
                String(
                  row.search_document_id,
                ),
            }),
        ...(row.knowledge_object_id == null
          ? {}
          : {
              knowledgeObjectId:
                String(
                  row.knowledge_object_id,
                ),
            }),
        occurredAt:
          String(row.occurred_at),
      }),
    );
  }
}

export class SqliteSearchLiveSubscriptionRepository
implements SearchLiveSubscriptionRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async get(
    subscriptionId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_live_subscriptions
          where subscription_id = ?
        `,
        [subscriptionId],
      );

    const row =
      result.rows[0];

    return row
      ? {
          subscriptionId:
            String(row.subscription_id),
          ownerId:
            String(row.owner_id),
          savedSearchId:
            String(row.saved_search_id),
          lastSequence:
            Number(row.last_sequence),
          active:
            Boolean(row.active),
          createdAt:
            String(row.created_at),
          updatedAt:
            String(row.updated_at),
        }
      : undefined;
  }

  async save(
    value: SearchLiveSubscription,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_live_subscriptions (
          subscription_id,
          owner_id,
          saved_search_id,
          last_sequence,
          active,
          created_at,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?)
        on conflict(subscription_id)
        do update set
          last_sequence = excluded.last_sequence,
          active = excluded.active,
          updated_at = excluded.updated_at
      `,
      [
        value.subscriptionId,
        value.ownerId,
        value.savedSearchId,
        value.lastSequence,
        value.active ? 1 : 0,
        value.createdAt,
        value.updatedAt,
      ],
    );
  }

  async listActive() {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select subscription_id
          from search_live_subscriptions
          where active = 1
          order by subscription_id asc
        `,
      );

    const values:
      SearchLiveSubscription[] = [];

    for (const row of result.rows) {
      const value =
        await this.get(
          String(row.subscription_id),
        );
      if (value) values.push(value);
    }

    return values;
  }
}

export class SqliteSearchSnapshotRepository
implements SearchSnapshotRepository {
  public constructor(
    private readonly sql:
      SqliteExecutor,
  ) {}

  async getLatest(
    subscriptionId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from search_result_snapshots
          where subscription_id = ?
          order by sequence desc
          limit 1
        `,
        [subscriptionId],
      );

    const row =
      result.rows[0];

    return row
      ? {
          subscriptionId:
            String(row.subscription_id),
          sequence:
            Number(row.sequence),
          resultIds:
            JSON.parse(
              String(row.result_ids_json),
            ),
          createdAt:
            String(row.created_at),
        }
      : undefined;
  }

  async save(
    snapshot: SearchResultSnapshot,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into search_result_snapshots (
          subscription_id,
          sequence,
          result_ids_json,
          created_at
        ) values (?, ?, ?, ?)
      `,
      [
        snapshot.subscriptionId,
        snapshot.sequence,
        JSON.stringify(
          snapshot.resultIds,
        ),
        snapshot.createdAt,
      ],
    );
  }
}

export const searchLiveSqliteMigrations = [
  {
    id:
      "0010_search_live",
    sql: `
      create table if not exists saved_searches (
        saved_search_id text primary key,
        owner_id text not null,
        name text not null,
        query text not null,
        ranking_profile text not null,
        live integer not null,
        created_at text not null,
        updated_at text not null,
        last_executed_at text
      );

      create index if not exists idx_saved_searches_owner
        on saved_searches(owner_id, updated_at);

      create table if not exists search_history (
        history_id text primary key,
        owner_id text not null,
        query text not null,
        ranking_profile text not null,
        result_count integer not null,
        executed_at text not null,
        duration_milliseconds integer not null
      );

      create index if not exists idx_search_history_owner
        on search_history(owner_id, executed_at);

      create table if not exists search_change_events (
        sequence integer primary key,
        kind text not null,
        search_document_id text,
        knowledge_object_id text,
        occurred_at text not null
      );

      create table if not exists search_live_subscriptions (
        subscription_id text primary key,
        owner_id text not null,
        saved_search_id text not null,
        last_sequence integer not null,
        active integer not null,
        created_at text not null,
        updated_at text not null
      );

      create table if not exists search_result_snapshots (
        subscription_id text not null,
        sequence integer not null,
        result_ids_json text not null,
        created_at text not null,
        primary key(subscription_id, sequence)
      );
    `,
  },
] as const;
