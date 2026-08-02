import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";
import type {
  PersonalKnowledgeConflict,
} from "@knowledgeos/personal-knowledge-sync-model";
import type {
  PersonalKnowledgeReplicaRecord,
} from "@knowledgeos/personal-knowledge-sync";
import type {
  PersonalKnowledgeConflictRepository,
  PersonalKnowledgeReplicaRepository,
} from "@knowledgeos/personal-knowledge-sync";

function replicaFromRow(
  row: SqliteRow,
): PersonalKnowledgeReplicaRecord {
  return {
    item:
      JSON.parse(
        String(row.item_json),
      ),
    vector:
      JSON.parse(
        String(row.vector_json),
      ),
    deviceId:
      String(row.device_id),
  };
}

export class SqlitePersonalKnowledgeReplicaRepository
implements PersonalKnowledgeReplicaRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async get(
    itemId: string,
    deviceId: string,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from personal_knowledge_replicas
          where item_id = ?
            and device_id = ?
        `,
        [itemId, deviceId],
      );

    const row = result.rows[0];
    return row ? replicaFromRow(row) : undefined;
  }

  async save(
    record: PersonalKnowledgeReplicaRecord,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into personal_knowledge_replicas (
          item_id,
          device_id,
          item_json,
          vector_json,
          updated_at
        ) values (?, ?, ?, ?, ?)
        on conflict(item_id, device_id)
        do update set
          item_json = excluded.item_json,
          vector_json = excluded.vector_json,
          updated_at = excluded.updated_at
      `,
      [
        record.item.itemId,
        record.deviceId,
        JSON.stringify(record.item),
        JSON.stringify(record.vector),
        record.item.updatedAt,
      ],
    );
  }
}

export class SqlitePersonalKnowledgeConflictRepository
implements PersonalKnowledgeConflictRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async save(
    conflict: PersonalKnowledgeConflict,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into personal_knowledge_conflicts (
          conflict_id,
          item_id,
          base_revision,
          local_json,
          remote_json,
          state,
          detected_at,
          resolved_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(conflict_id)
        do update set
          state = excluded.state,
          resolved_at = excluded.resolved_at
      `,
      [
        conflict.conflictId,
        conflict.itemId,
        conflict.baseRevision,
        JSON.stringify(conflict.local),
        JSON.stringify(conflict.remote),
        conflict.state,
        conflict.detectedAt,
        conflict.resolvedAt ?? null,
      ],
    );
  }

  async listOpen(): Promise<
    readonly PersonalKnowledgeConflict[]
  > {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from personal_knowledge_conflicts
          where resolved_at is null
          order by detected_at asc
        `,
      );

    return result.rows.map(
      (row) => ({
        conflictId:
          String(row.conflict_id),
        itemId:
          String(row.item_id),
        baseRevision:
          Number(row.base_revision),
        local:
          JSON.parse(
            String(row.local_json),
          ),
        remote:
          JSON.parse(
            String(row.remote_json),
          ),
        state:
          row.state as PersonalKnowledgeConflict["state"],
        detectedAt:
          String(row.detected_at),
        ...(row.resolved_at == null
          ? {}
          : {
              resolvedAt:
                String(row.resolved_at),
            }),
      }),
    );
  }
}

export const personalKnowledgeSyncMigrations = [
  {
    id: "0005_personal_knowledge_sync",
    sql: `
      create table if not exists personal_knowledge_replicas (
        item_id text not null,
        device_id text not null,
        item_json text not null,
        vector_json text not null,
        updated_at text not null,
        primary key(item_id, device_id)
      );

      create table if not exists personal_knowledge_conflicts (
        conflict_id text primary key,
        item_id text not null,
        base_revision integer not null,
        local_json text not null,
        remote_json text not null,
        state text not null,
        detected_at text not null,
        resolved_at text
      );

      create index if not exists idx_personal_knowledge_conflicts_open
        on personal_knowledge_conflicts(resolved_at, detected_at);
    `,
  },
] as const;
