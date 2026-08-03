export type ErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "not-found"
  | "conflict"
  | "compatibility"
  | "policy"
  | "rate-limit"
  | "transient-infrastructure"
  | "permanent-infrastructure"
  | "integrity"
  | "capacity"
  | "cancelled"
  | "timeout"
  | "unknown";

export interface KnowledgeOSError {
  readonly code: string;
  readonly category: ErrorCategory;
  readonly safeMessage: string;
  readonly retryable: boolean;
  readonly details?: Readonly<Record<string, string | number | boolean>>;
}

export function createError(
  error: KnowledgeOSError,
): KnowledgeOSError {
  return Object.freeze({ ...error });
}
