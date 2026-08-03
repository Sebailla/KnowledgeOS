import type {
  PersonalKnowledgeItem,
  PersonalKnowledgeRevision,
} from "./model.js";
import type {
  PersonalKnowledgeRepository,
  PersonalKnowledgeRevisionRepository,
  PersonalKnowledgeUnitOfWork,
} from "./repositories.js";

export class InMemoryPersonalKnowledgeRepository
implements PersonalKnowledgeRepository {
  private readonly values =
    new Map<string, PersonalKnowledgeItem>();

  async get(itemId: string) {
    return this.values.get(itemId);
  }

  async save(
    item: PersonalKnowledgeItem,
  ): Promise<void> {
    this.values.set(item.itemId, item);
  }

  async listByKnowledgeObject(
    knowledgeObjectId: string,
    includeDeleted = false,
  ) {
    return [...this.values.values()]
      .filter(
        (item) =>
          String(item.knowledgeObjectId) ===
            knowledgeObjectId &&
          (includeDeleted || !item.deleted),
      )
      .sort(
        (a, b) =>
          a.createdAt.localeCompare(
            b.createdAt,
          ),
      );
  }
}

export class InMemoryPersonalKnowledgeRevisionRepository
implements PersonalKnowledgeRevisionRepository {
  private readonly values =
    new Map<string, PersonalKnowledgeRevision[]>();

  async append(
    revision: PersonalKnowledgeRevision,
  ): Promise<void> {
    const list =
      this.values.get(revision.itemId) ?? [];
    list.push(revision);
    this.values.set(revision.itemId, list);
  }

  async list(itemId: string) {
    return [
      ...(this.values.get(itemId) ?? []),
    ];
  }
}

export class PassthroughPersonalKnowledgeUnitOfWork
implements PersonalKnowledgeUnitOfWork {
  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    return work();
  }
}
