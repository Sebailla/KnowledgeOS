import type { Brand } from "./brand.js";

export type KnowledgeObjectId = Brand<string, "KnowledgeObjectId">;
export type PublicationId = Brand<string, "PublicationId">;
export type SourceItemId = Brand<string, "SourceItemId">;
export type LocalLibraryId = Brand<string, "LocalLibraryId">;
export type AcquisitionId = Brand<string, "AcquisitionId">;
export type UdmNodeId = Brand<string, "UdmNodeId">;
export type DpmNodeId = Brand<string, "DpmNodeId">;
export type AnchorId = Brand<string, "AnchorId">;
export type PersonalKnowledgeId = Brand<string, "PersonalKnowledgeId">;
export type AnnotationId = Brand<string, "AnnotationId">;
export type RelationshipId = Brand<string, "RelationshipId">;
export type OperationId = Brand<string, "OperationId">;
export type CorrelationId = Brand<string, "CorrelationId">;
export type CausationId = Brand<string, "CausationId">;
export type WorkflowId = Brand<string, "WorkflowId">;
export type JobId = Brand<string, "JobId">;
export type EventId = Brand<string, "EventId">;
export type ActorId = Brand<string, "ActorId">;
export type DeviceId = Brand<string, "DeviceId">;
export type PluginId = Brand<string, "PluginId">;
export type ProviderId = Brand<string, "ProviderId">;

export type IdentityKind =
  | "knowledge-object"
  | "publication"
  | "source-item"
  | "local-library"
  | "acquisition"
  | "udm-node"
  | "dpm-node"
  | "anchor"
  | "personal-knowledge"
  | "annotation"
  | "relationship"
  | "operation"
  | "workflow"
  | "job"
  | "event"
  | "actor"
  | "device"
  | "plugin"
  | "provider";

export interface IdentityReference {
  readonly kind: IdentityKind;
  readonly value: string;
}

const ID_PATTERN = /^[a-z0-9][a-z0-9._:-]{7,255}$/i;

export function isValidIdentity(value: string): boolean {
  return ID_PATTERN.test(value);
}

export function assertValidIdentity(value: string): void {
  if (!isValidIdentity(value)) {
    throw new TypeError(`Invalid KnowledgeOS identity: ${value}`);
  }
}
