import type { EntityId } from "../identity/EntityId.js";

export abstract class Entity<TId extends EntityId> {
  protected constructor(
    public readonly id: TId,
  ) {}

  public equals(other: Entity<TId>): boolean {
    return this.constructor === other.constructor &&
      this.id.equals(other.id);
  }
}
