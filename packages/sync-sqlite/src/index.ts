import type {
  SyncChange,
  SyncConflict,
  SyncCursor,
} from "@knowledgeos/sync-contracts";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteSyncRepository {
  constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async appendChange(
    change: SyncChange,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into sync_changes (
          change_id,
          owner_id,
          replica_id,
          sequence,
          kind,
          entity_id,
          version,
          content_hash,
          payload_json,
          occurred_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(change_id)
        do nothing
      `,
      [
        change.changeId,
        change.ownerId,
        change.replicaId,
        change.sequence,
        change.kind,
        change.entityId,
        change.version,
        change.contentHash ?? null,
        JSON.stringify(change.payload),
        change.occurredAt,
      ],
    );
  }

  async listAfter(
    ownerId: string,
    replicaId: string,
    sequence: number,
    limit: number,
  ) {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from sync_changes
          where owner_id = ?
            and replica_id = ?
            and sequence > ?
          order by sequence asc
          limit ?
        `,
        [ownerId, replicaId, sequence, limit],
      );

    return result.rows.map(fromChangeRow);
  }

  async saveCursor(
    ownerId: string,
    targetReplicaId: string,
    cursor: SyncCursor,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into sync_cursors (
          owner_id,
          target_replica_id,
          source_replica_id,
          sequence
        ) values (?, ?, ?, ?)
        on conflict(owner_id, target_replica_id, source_replica_id)
        do update set
          sequence = excluded.sequence
      `,
      [
        ownerId,
        targetReplicaId,
        cursor.replicaId,
        cursor.sequence,
      ],
    );
  }

  async getCursor(
    ownerId: string,
    targetReplicaId: string,
    sourceReplicaId: string,
  ): Promise<SyncCursor> {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select sequence
          from sync_cursors
          where owner_id = ?
            and target_replica_id = ?
            and source_replica_id = ?
        `,
        [ownerId, targetReplicaId, sourceReplicaId],
      );

    return {
      replicaId: sourceReplicaId,
      sequence: Number(result.rows[0]?.sequence ?? 0),
    };
  }

  async saveConflict(
    conflict: SyncConflict,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into sync_conflicts (
          conflict_id,
          owner_id,
          entity_id,
          reason,
          local_change_json,
          remote_change_json,
          detected_at,
          resolved_at
        ) values (?, ?, ?, ?, ?, ?, ?, null)
        on conflict(conflict_id)
        do nothing
      `,
      [
        conflict.conflictId,
        conflict.ownerId,
        conflict.entityId,
        conflict.reason,
        JSON.stringify(conflict.localChange),
        JSON.stringify(conflict.remoteChange),
        conflict.detectedAt,
      ],
    );
  }
}

function fromChangeRow(
  row: SqliteRow,
): SyncChange {
  return {
    changeId: String(row.change_id),
    ownerId: String(row.owner_id),
    replicaId: String(row.replica_id),
    sequence: Number(row.sequence),
    kind: row.kind as SyncChange["kind"],
    entityId: String(row.entity_id),
    version: Number(row.version),
    ...(row.content_hash == null
      ? {}
      : {
          contentHash:
            String(row.content_hash),
        }),
    payload:
      JSON.parse(String(row.payload_json)),
    occurredAt:
      String(row.occurred_at),
  };
}

export const syncSqliteMigrations = [
  {
    id: "0017_sync_engine",
    sql: `
      create table if not exists sync_changes (
        change_id text primary key,
        owner_id text not null,
        replica_id text not null,
        sequence integer not null,
        kind text not null,
        entity_id text not null,
        version integer not null,
        content_hash text,
        payload_json text not null,
        occurred_at text not null,
        unique(owner_id, replica_id, sequence)
      );

      create index if not exists idx_sync_changes_cursor
        on sync_changes(
          owner_id,
          replica_id,
          sequence
        );

      create table if not exists sync_cursors (
        owner_id text not null,
        target_replica_id text not null,
        source_replica_id text not null,
        sequence integer not null,
        primary key(
          owner_id,
          target_replica_id,
          source_replica_id
        )
      );

      create table if not exists sync_conflicts (
        conflict_id text primary key,
        owner_id text not null,
        entity_id text not null,
        reason text not null,
        local_change_json text not null,
        remote_change_json text not null,
        detected_at text not null,
        resolved_at text
      );
    `,
  },
] as const;
