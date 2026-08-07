/** Versioned, path-free boundary for transient staged import sources. */
export type ImportState =
  | "Staged" | "Validating" | "Rejected" | "Failed"
  | "RecoveryRequired" | "ProcessingQueued";

export type StagedImportRequestV2 = Readonly<{
  contractVersion: 2;
  operationId: string;
  idempotencyKey: string;
  source: Readonly<{ kind: "staged-file"; capability: string }>;
  name: string;
  byteLength: number;
  sha256: string;
  mediaType?: string;
  extension?: string;
  runOCR?: boolean;
}>;

export type ProcessingLease = Readonly<{
  leaseId: string;
  capability: string;
  descriptor: number;
  owner: "core-host";
}>;

export type ImportContractErrorCode =
  | "IMPORT_CONTRACT_VERSION_UNSUPPORTED"
  | "INVALID_IMPORT_REQUEST"
  | "STAGED_SOURCE_REJECTED";

export interface ProcessingLeaseOwner {
  release(leaseId: string): Promise<void>;
}

/** Canonical JSON fixture consumed by TypeScript and Swift contract tests. */
export const STAGED_IMPORT_V2_FIXTURE_JSON =
  "{\"contractVersion\":2,\"operationId\":\"operation-1\",\"idempotencyKey\":\"key-1\",\"source\":{\"kind\":\"staged-file\",\"capability\":\"fixture-capability-token\"},\"name\":\"notes.md\",\"byteLength\":5,\"sha256\":\"2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824\"}";
