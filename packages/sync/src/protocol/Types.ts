export const USP_VERSION = "1.0" as const;

export type SyncEntityType =
  | "document" | "asset" | "annotation" | "bookmark"
  | "reading-position" | "workspace" | "graph-node" | "graph-edge";

export type SyncOperationType =
  | "create" | "update" | "delete" | "upsert";

export interface SyncOperation {
  readonly operationId: string;
  readonly protocolVersion: string;
  readonly entityType: SyncEntityType;
  readonly operationType: SyncOperationType;
  readonly entityId: string;
  readonly deviceId: string;
  readonly userId: string;
  readonly sequence: number;
  readonly timestamp: string;
  readonly payload: unknown;
  readonly checksum: string;
}

export interface SyncCursor {
  readonly serverSequence: number;
  readonly localSequence: number;
  readonly checkpointId?: string;
}

export interface OperationBatch {
  readonly batchId: string;
  readonly protocolVersion: string;
  readonly operations: readonly SyncOperation[];
  readonly cursor: SyncCursor;
  readonly createdAt: string;
  readonly checksum: string;
}

export interface OperationEnvelope {
  readonly protocolVersion: string;
  readonly requestId: string;
  readonly sessionId: string;
  readonly deviceId: string;
  readonly clientVersion: string;
  readonly batch: OperationBatch;
  readonly checksum: string;
}

export interface SyncAcknowledgement {
  readonly batchId: string;
  readonly acceptedOperationIds: readonly string[];
  readonly duplicateOperationIds: readonly string[];
  readonly cursor: SyncCursor;
  readonly processedAt: string;
}

export interface SyncCheckpoint {
  readonly checkpointId: string;
  readonly cursor: SyncCursor;
  readonly createdAt: string;
  readonly operationCount: number;
  readonly checksum: string;
}

export interface ProtocolCompatibility {
  readonly supported: boolean;
  readonly requestedVersion: string;
  readonly supportedVersions: readonly string[];
}
