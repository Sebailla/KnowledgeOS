import type { LibraryId } from "../identity/LibraryId.js";
import type { Library } from "../model/Library.js";
import type { LibraryRepository } from "./LibraryRepository.js";

export class InMemoryLibraryRepository implements LibraryRepository {
  private readonly libraries = new Map<string, Library>();

  public async get(id: LibraryId): Promise<Library | undefined> {
    return this.libraries.get(id.value);
  }

  public async save(aggregate: Library): Promise<void> {
    this.libraries.set(aggregate.id.value, aggregate);
  }

  public async delete(id: LibraryId): Promise<boolean> {
    return this.libraries.delete(id.value);
  }
}
