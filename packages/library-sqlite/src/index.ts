import type {
  LibraryEvent,
  LibraryObject,
  LibraryRelationship,
  LibrarySnapshot,
} from "@knowledgeos/library-contracts";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";

export class SqliteLibraryRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async saveObject(object: LibraryObject): Promise<void> {
    await this.sql.execute(
      `
        insert into library_objects (
          owner_id,
          object_id,
          type,
          logical_path,
          title,
          content_hash,
          version,
          tags_json,
          metadata_json,
          created_at,
          updated_at,
          deleted_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(owner_id, object_id)
        do update set
          type = excluded.type,
          logical_path = excluded.logical_path,
          title = excluded.title,
          content_hash = excluded.content_hash,
          version = excluded.version,
          tags_json = excluded.tags_json,
          metadata_json = excluded.metadata_json,
          updated_at = excluded.updated_at,
          deleted_at = excluded.deleted_at
      `,
      [
        object.identity.ownerId,
        object.identity.objectId,
        object.identity.type,
        object.logicalPath,
        object.title,
        object.contentHash,
        object.version,
        JSON.stringify(object.tags),
        JSON.stringify(object.metadata),
        object.createdAt,
        object.updatedAt,
        object.deletedAt ?? null,
      ],
    );
  }

  async saveRelationship(
    relationship: LibraryRelationship,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into library_relationships (
          owner_id,
          relationship_id,
          from_object_id,
          to_object_id,
          type,
          created_at
        ) values (?, ?, ?, ?, ?, ?)
        on conflict(owner_id, relationship_id)
        do nothing
      `,
      [
        relationship.ownerId,
        relationship.relationshipId,
        relationship.fromObjectId,
        relationship.toObjectId,
        relationship.type,
        relationship.createdAt,
      ],
    );
  }

  async loadState(ownerId: string) {
    const objects =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from library_objects
          where owner_id = ?
          order by object_id asc
        `,
        [ownerId],
      );

    const relationships =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from library_relationships
          where owner_id = ?
          order by relationship_id asc
        `,
        [ownerId],
      );

    const sequence =
      await this.sql.execute<SqliteRow>(
        `
          select coalesce(max(sequence), 0) as sequence
          from library_events
          where owner_id = ?
        `,
        [ownerId],
      );

    return {
      objects: objects.rows.map(objectFromRow),
      relationships: relationships.rows.map(relationshipFromRow),
      sequence: Number(sequence.rows[0]?.sequence ?? 0),
    };
  }

  async appendEvents(
    events: readonly LibraryEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.sql.execute(
        `
          insert into library_events (
            owner_id,
            sequence,
            event_id,
            transaction_id,
            type,
            object_id,
            relationship_id,
            occurred_at,
            payload_json
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          event.ownerId,
          event.sequence,
          event.eventId,
          event.transactionId,
          event.type,
          event.objectId ?? null,
          event.relationshipId ?? null,
          event.occurredAt,
          JSON.stringify(event.payload),
        ],
      );
    }
  }

  async saveSnapshot(
    snapshot: LibrarySnapshot,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into library_snapshots (
          owner_id,
          snapshot_id,
          sequence,
          objects_json,
          relationships_json,
          created_at
        ) values (?, ?, ?, ?, ?, ?)
      `,
      [
        snapshot.ownerId,
        snapshot.snapshotId,
        snapshot.sequence,
        JSON.stringify(snapshot.objects),
        JSON.stringify(snapshot.relationships),
        snapshot.createdAt,
      ],
    );
  }

  async latestSnapshot(
    ownerId: string,
  ): Promise<LibrarySnapshot | undefined> {
    const result =
      await this.sql.execute<SqliteRow>(
        `
          select *
          from library_snapshots
          where owner_id = ?
          order by sequence desc
          limit 1
        `,
        [ownerId],
      );

    const row = result.rows[0];
    return row
      ? {
          ownerId: String(row.owner_id),
          snapshotId: String(row.snapshot_id),
          sequence: Number(row.sequence),
          objects: JSON.parse(String(row.objects_json)),
          relationships: JSON.parse(String(row.relationships_json)),
          createdAt: String(row.created_at),
        }
      : undefined;
  }
}

function objectFromRow(row: SqliteRow): LibraryObject {
  return {
    identity: {
      ownerId: String(row.owner_id),
      objectId: String(row.object_id),
      type: row.type as LibraryObject["identity"]["type"],
    },
    logicalPath: String(row.logical_path),
    title: String(row.title),
    contentHash: String(row.content_hash),
    version: Number(row.version),
    tags: JSON.parse(String(row.tags_json)),
    metadata: JSON.parse(String(row.metadata_json)),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    ...(row.deleted_at == null
      ? {}
      : { deletedAt: String(row.deleted_at) }),
  };
}

function relationshipFromRow(row: SqliteRow): LibraryRelationship {
  return {
    ownerId: String(row.owner_id),
    relationshipId: String(row.relationship_id),
    fromObjectId: String(row.from_object_id),
    toObjectId: String(row.to_object_id),
    type: row.type as LibraryRelationship["type"],
    createdAt: String(row.created_at),
  };
}

export const librarySqliteMigrations = [
  {
    id: "0016_library_engine",
    sql: `
      create table if not exists library_objects (
        owner_id text not null,
        object_id text not null,
        type text not null,
        logical_path text not null,
        title text not null,
        content_hash text not null,
        version integer not null,
        tags_json text not null,
        metadata_json text not null,
        created_at text not null,
        updated_at text not null,
        deleted_at text,
        primary key(owner_id, object_id)
      );

      create unique index if not exists idx_library_objects_path_active
        on library_objects(owner_id, logical_path)
        where deleted_at is null;

      create index if not exists idx_library_objects_hash
        on library_objects(owner_id, content_hash);

      create table if not exists library_relationships (
        owner_id text not null,
        relationship_id text not null,
        from_object_id text not null,
        to_object_id text not null,
        type text not null,
        created_at text not null,
        primary key(owner_id, relationship_id)
      );

      create index if not exists idx_library_relationships_from
        on library_relationships(owner_id, from_object_id, type);

      create index if not exists idx_library_relationships_to
        on library_relationships(owner_id, to_object_id, type);

      create table if not exists library_events (
        owner_id text not null,
        sequence integer not null,
        event_id text not null,
        transaction_id text not null,
        type text not null,
        object_id text,
        relationship_id text,
        occurred_at text not null,
        payload_json text not null,
        primary key(owner_id, sequence),
        unique(event_id)
      );

      create table if not exists library_snapshots (
        owner_id text not null,
        snapshot_id text not null,
        sequence integer not null,
        objects_json text not null,
        relationships_json text not null,
        created_at text not null,
        primary key(owner_id, snapshot_id)
      );

      create index if not exists idx_library_snapshots_sequence
        on library_snapshots(owner_id, sequence);
    `,
  },
] as const;
