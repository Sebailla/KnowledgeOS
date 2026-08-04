import { DomainInvariantError } from "@knowledgeos/domain";
import type { CollectionId } from "../identity/CollectionId.js";
import type { LibraryId } from "../identity/LibraryId.js";
import type { WorkspaceId } from "../identity/WorkspaceId.js";
import { Collection } from "../model/Collection.js";
import { Library, type LibraryDependencies } from "../model/Library.js";
import { Workspace } from "../model/Workspace.js";
import type { LibraryRepository } from "../repositories/LibraryRepository.js";

export interface LibraryServiceDependencies extends LibraryDependencies {
  readonly repository: LibraryRepository;
}

export class LibraryService {
  public constructor(private readonly dependencies: LibraryServiceDependencies) {}

  public async createLibrary(id: LibraryId, name: string): Promise<Library> {
    if (await this.dependencies.repository.get(id)) {
      throw new DomainInvariantError(`Library '${id.value}' already exists.`);
    }
    const library = Library.create(id, name, this.dependencies);
    await this.dependencies.repository.save(library);
    return library;
  }

  public async addCollection(
    libraryId: LibraryId,
    collectionId: CollectionId,
    name: string,
  ): Promise<Collection> {
    const library = await this.getRequiredLibrary(libraryId);
    const collection = new Collection(collectionId, name);
    library.addCollection(collection);
    await this.dependencies.repository.save(library);
    return collection;
  }

  public async addWorkspace(
    libraryId: LibraryId,
    workspaceId: WorkspaceId,
    name: string,
  ): Promise<Workspace> {
    const library = await this.getRequiredLibrary(libraryId);
    const workspace = new Workspace(workspaceId, name);
    library.addWorkspace(workspace);
    await this.dependencies.repository.save(library);
    return workspace;
  }

  private async getRequiredLibrary(id: LibraryId): Promise<Library> {
    const library = await this.dependencies.repository.get(id);
    if (!library) {
      throw new DomainInvariantError(`Library '${id.value}' does not exist.`);
    }
    return library;
  }
}
