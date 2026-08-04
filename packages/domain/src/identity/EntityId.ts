import { DomainInvariantError } from "../errors/DomainInvariantError.js";

export abstract class EntityId {
  protected constructor(
    public readonly value: string,
  ) {
    if (value.trim().length === 0) {
      throw new DomainInvariantError(
        "Entity identifier cannot be empty.",
      );
    }
  }

  public equals(other: EntityId): boolean {
    return this.constructor === other.constructor &&
      this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
