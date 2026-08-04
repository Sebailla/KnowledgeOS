import { DomainError } from "./DomainError.js";

export interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

export class DomainValidationError extends DomainError {
  public constructor(
    public readonly issues: readonly ValidationIssue[],
  ) {
    super(
      issues.map((issue) => `${issue.path}: ${issue.message}`).join("; "),
      "DOMAIN_VALIDATION_FAILED",
    );
  }
}
