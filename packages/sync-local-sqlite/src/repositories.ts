import type {
  ContentFingerprint,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  SqliteExecutor,
  SqliteRow,
} from "@knowledgeos/local-library-sqlite";
import type {
  MasterTransferDescriptor,
  PersistedTransferState,
  TransferDescriptorRepository,
  TransferStateRepository,
} from "@knowledgeos/sync-local-runtime";

function descriptorFromRow(
  row: SqliteRow,
): MasterTransferDescriptor {
  return {
    transferId: String(row.transfer_id),
    planId: String(row.plan_id),
    localLibraryId:
      row.local_library_id as LocalLibraryId,
    publicationId:
      row.publication_id as PublicationId,
    knowledgeObjectId:
      row.knowledge_object_id as KnowledgeObjectId,
    versionId:
      row.version_id as VersionId,
    sourceItemId:
      row.source_item_id as SourceItemId,
    title: String(row.title),
    mediaType: String(row.media_type),
    byteLength: Number(row.byte_length),
    contentFingerprint:
      row.content_fingerprint as ContentFingerprint,
  };
}

function stateFromRow(
  row: SqliteRow,
): PersistedTransferState {
  return {
    transferId: String(row.transfer_id),
    planId: String(row.plan_id),
    receivedBytes: Number(row.received_bytes),
    totalBytes: Number(row.total_bytes),
    completed: Boolean(row.completed),
    checksumVerified:
      Boolean(row.checksum_verified),
    temporaryPath: String(row.temporary_path),
    updatedAt: String(row.updated_at),
  };
}

export class SqliteTransferDescriptorRepository
implements TransferDescriptorRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async get(
    transferId: string,
  ): Promise<MasterTransferDescriptor | undefined> {
    const result = await this.sql.execute<SqliteRow>(
      `
        select *
        from sync_transfer_descriptors
        where transfer_id = ?
      `,
      [transferId],
    );
    const row = result.rows[0];
    return row ? descriptorFromRow(row) : undefined;
  }

  async save(
    descriptor: MasterTransferDescriptor,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into sync_transfer_descriptors (
          transfer_id,
          plan_id,
          local_library_id,
          publication_id,
          knowledge_object_id,
          version_id,
          source_item_id,
          title,
          media_type,
          byte_length,
          content_fingerprint
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(transfer_id)
        do update set
          plan_id = excluded.plan_id,
          local_library_id = excluded.local_library_id,
          publication_id = excluded.publication_id,
          knowledge_object_id = excluded.knowledge_object_id,
          version_id = excluded.version_id,
          source_item_id = excluded.source_item_id,
          title = excluded.title,
          media_type = excluded.media_type,
          byte_length = excluded.byte_length,
          content_fingerprint = excluded.content_fingerprint
      `,
      [
        descriptor.transferId,
        descriptor.planId,
        descriptor.localLibraryId,
        descriptor.publicationId,
        descriptor.knowledgeObjectId,
        descriptor.versionId,
        descriptor.sourceItemId,
        descriptor.title,
        descriptor.mediaType,
        descriptor.byteLength,
        descriptor.contentFingerprint,
      ],
    );
  }
}

export class SqliteTransferStateRepository
implements TransferStateRepository {
  public constructor(
    private readonly sql: SqliteExecutor,
  ) {}

  async get(
    transferId: string,
  ): Promise<PersistedTransferState | undefined> {
    const result = await this.sql.execute<SqliteRow>(
      `
        select *
        from sync_transfer_states
        where transfer_id = ?
      `,
      [transferId],
    );
    const row = result.rows[0];
    return row ? stateFromRow(row) : undefined;
  }

  async save(
    state: PersistedTransferState,
  ): Promise<void> {
    await this.sql.execute(
      `
        insert into sync_transfer_states (
          transfer_id,
          plan_id,
          received_bytes,
          total_bytes,
          completed,
          checksum_verified,
          temporary_path,
          updated_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(transfer_id)
        do update set
          plan_id = excluded.plan_id,
          received_bytes = excluded.received_bytes,
          total_bytes = excluded.total_bytes,
          completed = excluded.completed,
          checksum_verified = excluded.checksum_verified,
          temporary_path = excluded.temporary_path,
          updated_at = excluded.updated_at
      `,
      [
        state.transferId,
        state.planId,
        state.receivedBytes,
        state.totalBytes,
        state.completed ? 1 : 0,
        state.checksumVerified ? 1 : 0,
        state.temporaryPath,
        state.updatedAt,
      ],
    );
  }
}

export const syncLocalSqliteMigrations = [
  {
    id: "0002_sync_local_runtime",
    sql: `
      create table if not exists sync_transfer_descriptors (
        transfer_id text primary key,
        plan_id text not null,
        local_library_id text not null,
        publication_id text not null,
        knowledge_object_id text not null,
        version_id text not null,
        source_item_id text not null,
        title text not null,
        media_type text not null,
        byte_length integer not null check (byte_length >= 0),
        content_fingerprint text not null
      );

      create index if not exists idx_sync_transfer_descriptors_plan
        on sync_transfer_descriptors(plan_id);

      create table if not exists sync_transfer_states (
        transfer_id text primary key
          references sync_transfer_descriptors(transfer_id)
          on delete cascade,
        plan_id text not null,
        received_bytes integer not null check (received_bytes >= 0),
        total_bytes integer not null check (total_bytes >= 0),
        completed integer not null,
        checksum_verified integer not null,
        temporary_path text not null,
        updated_at text not null
      );

      create index if not exists idx_sync_transfer_states_plan
        on sync_transfer_states(plan_id);
    `,
  },
] as const;
