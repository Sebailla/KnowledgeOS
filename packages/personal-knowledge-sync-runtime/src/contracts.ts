export interface PersonalKnowledgeDevice {
  readonly deviceId: string;
  readonly ownerId: string;
  readonly platform: string;
  readonly applicationVersion: string;
  readonly capabilities: readonly string[];
  readonly createdAt: string;
  readonly lastSeenAt: string;
  readonly revokedAt?: string;
}

export interface PersonalKnowledgeSyncEvent {
  readonly cursor: number;
  readonly ownerId: string;
  readonly deviceId: string;
  readonly itemId: string;
  readonly operation:
    | "upsert"
    | "delete"
    | "resolve-conflict";
  readonly payload: unknown;
  readonly occurredAt: string;
}

export interface PersonalKnowledgeConflictRecord {
  readonly conflictId: string;
  readonly ownerId: string;
  readonly itemId: string;
  readonly localPayload: unknown;
  readonly remotePayload: unknown;
  readonly detectedAt: string;
  readonly resolvedAt?: string;
  readonly resolutionPayload?: unknown;
}

export interface PersonalKnowledgeDeviceRepository {
  register(
    device: PersonalKnowledgeDevice,
  ): Promise<void>;

  get(
    ownerId: string,
    deviceId: string,
  ): Promise<PersonalKnowledgeDevice | undefined>;

  list(
    ownerId: string,
  ): Promise<readonly PersonalKnowledgeDevice[]>;

  revoke(
    ownerId: string,
    deviceId: string,
    revokedAt: string,
  ): Promise<boolean>;

  touch(
    ownerId: string,
    deviceId: string,
    lastSeenAt: string,
  ): Promise<void>;
}

export interface PersonalKnowledgeEventRepository {
  append(
    events: readonly Omit<
      PersonalKnowledgeSyncEvent,
      "cursor"
    >[],
  ): Promise<readonly PersonalKnowledgeSyncEvent[]>;

  listAfter(
    ownerId: string,
    afterCursor: number,
    limit: number,
  ): Promise<readonly PersonalKnowledgeSyncEvent[]>;
}

export interface PersonalKnowledgeConflictStore {
  get(
    ownerId: string,
    conflictId: string,
  ): Promise<PersonalKnowledgeConflictRecord | undefined>;

  listOpen(
    ownerId: string,
  ): Promise<readonly PersonalKnowledgeConflictRecord[]>;

  resolve(
    ownerId: string,
    conflictId: string,
    resolvedAt: string,
    resolutionPayload: unknown,
  ): Promise<boolean>;
}

export interface PersonalKnowledgeCursorRepository {
  get(
    ownerId: string,
    deviceId: string,
  ): Promise<number>;

  save(
    ownerId: string,
    deviceId: string,
    cursor: number,
    updatedAt: string,
  ): Promise<void>;
}

export interface PersonalKnowledgeAuditRepository {
  append(
    entry: {
      readonly ownerId: string;
      readonly deviceId: string;
      readonly action: string;
      readonly subjectId?: string;
      readonly result: "success" | "failure";
      readonly occurredAt: string;
      readonly metadata?: unknown;
    },
  ): Promise<void>;
}
