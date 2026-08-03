import type {
  LibraryEvent,
  LibraryObject,
  LibraryOperation,
  LibraryRelationship,
  LibraryTransaction,
} from "@knowledgeos/library-contracts";
import {
  LibraryObjectValidator,
  LibraryRelationshipValidator,
  canonicalizeLibraryObject,
} from "@knowledgeos/library-model";

export interface LibraryState {
  readonly objects: readonly LibraryObject[];
  readonly relationships: readonly LibraryRelationship[];
  readonly sequence: number;
}

export interface LibraryTransactionResult {
  readonly state: LibraryState;
  readonly events: readonly LibraryEvent[];
}

export class LibraryTransactionEngine {
  private readonly objectValidator =
    new LibraryObjectValidator();
  private readonly relationshipValidator =
    new LibraryRelationshipValidator();

  apply(
    state: LibraryState,
    transaction: LibraryTransaction,
  ): LibraryTransactionResult {
    let objects = [...state.objects];
    let relationships = [...state.relationships];
    const events: LibraryEvent[] = [];
    let sequence = state.sequence;

    for (const operation of transaction.operations) {
      const result = this.applyOperation(
        objects,
        relationships,
        operation,
      );
      objects = result.objects;
      relationships = result.relationships;
      sequence += 1;

      events.push({
        eventId: `${transaction.transactionId}:event:${sequence}`,
        transactionId: transaction.transactionId,
        ownerId: transaction.ownerId,
        sequence,
        type: result.eventType,
        ...(result.objectId ? { objectId: result.objectId } : {}),
        ...(result.relationshipId
          ? { relationshipId: result.relationshipId }
          : {}),
        occurredAt: transaction.createdAt,
        payload: result.payload,
      });
    }

    return {
      state: {
        objects,
        relationships,
        sequence,
      },
      events,
    };
  }

  private applyOperation(
    objects: readonly LibraryObject[],
    relationships: readonly LibraryRelationship[],
    operation: LibraryOperation,
  ): {
    objects: LibraryObject[];
    relationships: LibraryRelationship[];
    eventType: LibraryEvent["type"];
    objectId?: string;
    relationshipId?: string;
    payload: Readonly<Record<string, unknown>>;
  } {
    if (operation.kind === "create") {
      const object = canonicalizeLibraryObject(operation.object);

      if (
        objects.some(
          (value) =>
            value.identity.objectId === object.identity.objectId &&
            value.identity.ownerId === object.identity.ownerId,
        )
      ) {
        throw new Error(`Object already exists: ${object.identity.objectId}`);
      }

      const issues = this.objectValidator.validate(object);
      if (issues.length > 0) {
        throw new Error(issues.join(","));
      }

      return {
        objects: [...objects, object],
        relationships: [...relationships],
        eventType: "object-created",
        objectId: object.identity.objectId,
        payload: { version: object.version },
      };
    }

    if (operation.kind === "update") {
      const index = objects.findIndex(
        (value) =>
          value.identity.objectId === operation.object.identity.objectId &&
          value.identity.ownerId === operation.object.identity.ownerId,
      );
      if (index < 0) {
        throw new Error(`Object not found: ${operation.object.identity.objectId}`);
      }
      const current = objects[index]!;
      if (current.version !== operation.expectedVersion) {
        throw new Error("Version conflict");
      }
      const updated = canonicalizeLibraryObject({
        ...operation.object,
        version: current.version + 1,
      });
      const next = [...objects];
      next[index] = updated;

      return {
        objects: next,
        relationships: [...relationships],
        eventType: "object-updated",
        objectId: updated.identity.objectId,
        payload: {
          previousVersion: current.version,
          version: updated.version,
        },
      };
    }

    if (operation.kind === "delete") {
      const index = objects.findIndex(
        (value) =>
          value.identity.objectId === operation.objectId &&
          value.identity.ownerId === operation.ownerId,
      );
      if (index < 0) throw new Error(`Object not found: ${operation.objectId}`);
      const current = objects[index]!;
      if (current.version !== operation.expectedVersion) {
        throw new Error("Version conflict");
      }
      const next = [...objects];
      next[index] = {
        ...current,
        version: current.version + 1,
        updatedAt: operation.deletedAt,
        deletedAt: operation.deletedAt,
      };

      return {
        objects: next,
        relationships: [...relationships],
        eventType: "object-deleted",
        objectId: operation.objectId,
        payload: { version: current.version + 1 },
      };
    }

    if (operation.kind === "restore") {
      const index = objects.findIndex(
        (value) =>
          value.identity.objectId === operation.objectId &&
          value.identity.ownerId === operation.ownerId,
      );
      if (index < 0) throw new Error(`Object not found: ${operation.objectId}`);
      const current = objects[index]!;
      if (current.version !== operation.expectedVersion) {
        throw new Error("Version conflict");
      }
      const next = [...objects];
      const restored: LibraryObject = {
        identity: current.identity,
        logicalPath: current.logicalPath,
        title: current.title,
        contentHash: current.contentHash,
        version: current.version + 1,
        tags: current.tags,
        metadata: current.metadata,
        createdAt: current.createdAt,
        updatedAt: current.updatedAt,
      };
      next[index] = restored;

      return {
        objects: next,
        relationships: [...relationships],
        eventType: "object-restored",
        objectId: operation.objectId,
        payload: { version: current.version + 1 },
      };
    }

    const issues = this.relationshipValidator.validate(
      operation.relationship,
      objects,
    );
    if (issues.length > 0) {
      throw new Error(issues.join(","));
    }

    return {
      objects: [...objects],
      relationships: [...relationships, operation.relationship],
      eventType: "relationship-created",
      relationshipId: operation.relationship.relationshipId,
      payload: {
        fromObjectId: operation.relationship.fromObjectId,
        toObjectId: operation.relationship.toObjectId,
      },
    };
  }
}
