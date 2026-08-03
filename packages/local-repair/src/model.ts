export type LocalRepairIssueCode =
  | "catalog-missing-object"
  | "object-missing-catalog"
  | "checksum-mismatch"
  | "length-mismatch"
  | "invalid-offline-state";

export interface LocalRepairIssue {
  readonly code: LocalRepairIssueCode;
  readonly publicationId?: string;
  readonly relativePath?: string;
}

export interface LocalRepairReport {
  readonly issues: readonly LocalRepairIssue[];
  readonly repaired: readonly LocalRepairIssue[];
}
