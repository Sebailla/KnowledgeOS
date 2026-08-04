import type {
  ContractVersion,
  DeviceId,
  PersonalKnowledgeId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export type PersonalKnowledgeEntityType =
  | "annotation"
  | "highlight"
  | "note"
  | "bookmark"
  | "reading-progress"
  | "collection"
  | "personal-relationship"
  | "personal-ai-artifact";

export interface SyncChange {
  readonly entityId: PersonalKnowledgeId;
  readonly entityType: PersonalKnowledgeEntityType;
  readonly versionId: VersionId;
  readonly parentVersionIds: readonly VersionId[];
  readonly operation: "upsert" | "delete";
  readonly payload?: unknown;
}

export interface SynchronizePayload {
  readonly sourceDeviceId: DeviceId;
  readonly envelopeVersion: ContractVersion;
  readonly changes: readonly SyncChange[];
  readonly cursor?: string;
}

export type SynchronizePersonalKnowledgeCommand = Command<
  "sync.personal-knowledge",
  SynchronizePayload
>;

export type GetSyncStatusQuery = Query<
  "sync.get-status",
  { readonly deviceId: DeviceId }
>;
