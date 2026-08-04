import { DomainError } from "./DomainError.js";

export class DomainInvariantError extends DomainError {
  public constructor(message: string) {
    super(message, "DOMAIN_INVARIANT_VIOLATION");
  }
}
