import {
  DomainValidationError,
  type ValidationIssue,
} from "./errors/DomainValidationError.js";

export class ValidationCollector {
  private readonly issues: ValidationIssue[] = [];

  public add(path: string, message: string): this {
    this.issues.push({ path, message });
    return this;
  }

  public require(
    condition: boolean,
    path: string,
    message: string,
  ): this {
    if (!condition) {
      this.add(path, message);
    }

    return this;
  }

  public throwIfInvalid(): void {
    if (this.issues.length > 0) {
      throw new DomainValidationError(this.issues);
    }
  }

  public get all(): readonly ValidationIssue[] {
    return [...this.issues];
  }
}
