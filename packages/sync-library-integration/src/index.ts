import type {
  LibraryEvent,
} from "@knowledgeos/library-contracts";
import type {
  SyncChange,
} from "@knowledgeos/sync-contracts";

export class LibraryEventToSyncChangeMapper {
  map(
    event: LibraryEvent,
    replicaId: string,
  ): SyncChange | undefined {
    if (!event.objectId && !event.relationshipId) {
      return undefined;
    }

    const kind =
      event.type === "object-deleted"
        ? "object-delete"
        : event.type === "relationship-created"
          ? "relationship-upsert"
          : "object-upsert";

    return {
      changeId:
        `sync:${replicaId}:${event.sequence}`,
      ownerId:
        event.ownerId,
      replicaId,
      sequence:
        event.sequence,
      kind,
      entityId:
        event.objectId ??
        event.relationshipId!,
      version:
        Number(
          event.payload.version ?? 1,
        ),
      ...(typeof event.payload.contentHash === "string"
        ? {
            contentHash:
              event.payload.contentHash,
          }
        : {}),
      payload:
        event.payload,
      occurredAt:
        event.occurredAt,
    };
  }
}
