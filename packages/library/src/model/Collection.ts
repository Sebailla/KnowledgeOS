import { DomainInvariantError, Entity } from "@knowledgeos/domain";
import type { CollectionId } from "../identity/CollectionId.js";

export class Collection extends Entity<CollectionId> {
  private currentName: string;
  private readonly objectIds = new Set<string>();

  public constructor(id: CollectionId, name: string) {
    super(id);
    this.currentName = Collection.validateName(name);
  }

  public get name(): string { return this.currentName; }
  public get members(): readonly string[] { return [...this.objectIds]; }

  public rename(name: string): void {
    this.currentName = Collection.validateName(name);
  }

  public addObject(objectId: string): void {
    if (objectId.trim().length === 0) {
      throw new DomainInvariantError("Collection object id cannot be empty.");
    }
    this.objectIds.add(objectId);
  }

  public removeObject(objectId: string): boolean {
    return this.objectIds.delete(objectId);
  }

  private static validateName(name: string): string {
    const normalized = name.trim();
    if (normalized.length === 0) {
      throw new DomainInvariantError("Collection name cannot be empty.");
    }
    return normalized;
  }
}
