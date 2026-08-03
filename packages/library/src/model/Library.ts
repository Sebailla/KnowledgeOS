import { AggregateRoot, DomainInvariantError } from "@knowledgeos/domain";
import { createLibraryEvent } from "../events/LibraryEvents.js";
import type { LibraryId } from "../identity/LibraryId.js";
import { Collection } from "./Collection.js";
import { Workspace } from "./Workspace.js";

export interface LibraryDependencies {
  readonly nextEventId: () => string;
  readonly now: () => string;
}

export class Library extends AggregateRoot<LibraryId> {
  private currentName: string;
  private readonly collectionsById = new Map<string, Collection>();
  private readonly workspacesById = new Map<string, Workspace>();

  private constructor(
    id: LibraryId,
    name: string,
    private readonly dependencies: LibraryDependencies,
    version = 0,
  ) {
    super(id, version);
    this.currentName = Library.validateName(name);
  }

  public static create(
    id: LibraryId,
    name: string,
    dependencies: LibraryDependencies,
  ): Library {
    const library = new Library(id, name, dependencies);
    library.record(
      createLibraryEvent(
        "library.created",
        dependencies.nextEventId(),
        id.value,
        library.version + 1,
        dependencies.now(),
        { name: library.currentName },
      ),
    );
    return library;
  }

  public static rehydrate(
    id: LibraryId,
    name: string,
    dependencies: LibraryDependencies,
    version: number,
  ): Library {
    return new Library(id, name, dependencies, version);
  }

  public get name(): string { return this.currentName; }
  public get collections(): readonly Collection[] { return [...this.collectionsById.values()]; }
  public get workspaces(): readonly Workspace[] { return [...this.workspacesById.values()]; }

  public rename(name: string): void {
    this.currentName = Library.validateName(name);
  }

  public addCollection(collection: Collection): void {
    if (this.collectionsById.has(collection.id.value)) {
      throw new DomainInvariantError(`Collection '${collection.id.value}' already exists.`);
    }
    this.collectionsById.set(collection.id.value, collection);
    this.record(
      createLibraryEvent(
        "library.collection-added",
        this.dependencies.nextEventId(),
        this.id.value,
        this.version + 1,
        this.dependencies.now(),
        { collectionId: collection.id.value, name: collection.name },
      ),
    );
  }

  public addWorkspace(workspace: Workspace): void {
    if (this.workspacesById.has(workspace.id.value)) {
      throw new DomainInvariantError(`Workspace '${workspace.id.value}' already exists.`);
    }
    this.workspacesById.set(workspace.id.value, workspace);
    this.record(
      createLibraryEvent(
        "library.workspace-added",
        this.dependencies.nextEventId(),
        this.id.value,
        this.version + 1,
        this.dependencies.now(),
        { workspaceId: workspace.id.value, name: workspace.name },
      ),
    );
  }

  public findCollection(id: string): Collection | undefined {
    return this.collectionsById.get(id);
  }

  public findWorkspace(id: string): Workspace | undefined {
    return this.workspacesById.get(id);
  }

  private static validateName(name: string): string {
    const normalized = name.trim();
    if (normalized.length === 0) {
      throw new DomainInvariantError("Library name cannot be empty.");
    }
    return normalized;
  }
}
