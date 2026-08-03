import type { PersonalKnowledgeReplicaRecord } from "@knowledgeos/personal-knowledge-sync";

export interface RegisteredPersonalKnowledgeDevice {
  readonly deviceId: string;
  readonly ownerId: string;
  readonly platform: string;
  readonly applicationVersion: string;
  readonly capabilities: readonly string[];
  readonly revoked: boolean;
  readonly createdAt: string;
  readonly lastSeenAt: string;
}

export interface PersonalKnowledgeSyncEvent {
  readonly cursor: number;
  readonly ownerId: string;
  readonly deviceId: string;
  readonly itemId: string;
  readonly operation: "upsert" | "delete" | "resolve";
  readonly record: PersonalKnowledgeReplicaRecord;
  readonly occurredAt: string;
}
