export type LibraryObjectType =
  | "document"
  | "asset"
  | "annotation"
  | "knowledge-object"
  | "conversation"
  | "workspace"
  | "plugin-data"
  | "graph"
  | "prompt"
  | "other";

export interface LibraryObjectIdentity {
  readonly objectId: string;
  readonly ownerId: string;
  readonly type: LibraryObjectType;
}

export interface LibraryObject {
  readonly identity: LibraryObjectIdentity;
  readonly logicalPath: string;
  readonly title: string;
  readonly contentHash: string;
  readonly version: number;
  readonly tags: readonly string[];
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string;
}

export interface LibraryRelationship {
  readonly relationshipId: string;
  readonly ownerId: string;
  readonly fromObjectId: string;
  readonly toObjectId: string;
  readonly type:
    | "parent"
    | "child"
    | "reference"
    | "dependency"
    | "attachment"
    | "derived"
    | "related";
  readonly createdAt: string;
}

export type LibraryOperation =
  | {
      readonly kind: "create";
      readonly object: LibraryObject;
    }
  | {
      readonly kind: "update";
      readonly object: LibraryObject;
      readonly expectedVersion: number;
    }
  | {
      readonly kind: "delete";
      readonly objectId: string;
      readonly ownerId: string;
      readonly deletedAt: string;
      readonly expectedVersion: number;
    }
  | {
      readonly kind: "restore";
      readonly objectId: string;
      readonly ownerId: string;
      readonly expectedVersion: number;
    }
  | {
      readonly kind: "relate";
      readonly relationship: LibraryRelationship;
    };

export interface LibraryTransaction {
  readonly transactionId: string;
  readonly ownerId: string;
  readonly operations: readonly LibraryOperation[];
  readonly createdAt: string;
}

export interface LibraryEvent {
  readonly eventId: string;
  readonly transactionId: string;
  readonly ownerId: string;
  readonly sequence: number;
  readonly type:
    | "object-created"
    | "object-updated"
    | "object-deleted"
    | "object-restored"
    | "relationship-created";
  readonly objectId?: string;
  readonly relationshipId?: string;
  readonly occurredAt: string;
  readonly payload:
    Readonly<Record<string, unknown>>;
}

export interface LibrarySnapshot {
  readonly snapshotId: string;
  readonly ownerId: string;
  readonly sequence: number;
  readonly objects: readonly LibraryObject[];
  readonly relationships: readonly LibraryRelationship[];
  readonly createdAt: string;
}
