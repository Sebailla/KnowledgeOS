import { ImportValidationError } from "./errors/ImportValidationError.js";
import type { ImportSource } from "./model/ImportSource.js";

export class ImportValidator {
  public validate(source: ImportSource): void {
    const issues: string[] = [];

    if (source.id.trim().length === 0) {
      issues.push("Source id is required.");
    }

    if (source.name.trim().length === 0) {
      issues.push("Source name is required.");
    }

    if (source.content.trim().length === 0) {
      issues.push("Source content is empty.");
    }

    if (issues.length > 0) {
      throw new ImportValidationError(issues);
    }
  }
}
