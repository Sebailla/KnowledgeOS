import { ImportError } from "./ImportError.js";

export class ImportValidationError extends ImportError {
  public constructor(
    public readonly issues: readonly string[],
  ) {
    super(
      issues.join("; "),
      "IMPORT_VALIDATION_FAILED",
    );
  }
}
