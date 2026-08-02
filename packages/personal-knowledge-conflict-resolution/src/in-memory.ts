import type {
  PersonalKnowledgeConflict,
} from "@knowledgeos/personal-knowledge-sync-model";
import type {
  PersonalKnowledgeItem,
} from "@knowledgeos/personal-knowledge";
import type {
  ConflictResolutionItemRepository,
  ConflictResolutionRepository,
  ConflictResolutionUnitOfWork,
} from "./contracts.js";
import type {
  ResolvedConflict,
} from "./model.js";

export class InMemoryConflictResolutionRepository
implements ConflictResolutionRepository {
  private readonly conflicts =
    new Map<string, PersonalKnowledgeConflict>();
  private readonly resolved =
    new Map<string, ResolvedConflict>();

  seed(
    conflict: PersonalKnowledgeConflict,
  ): void {
    this.conflicts.set(
      conflict.conflictId,
      conflict,
    );
  }

  async get(
    conflictId: string,
  ) {
    return this.conflicts.get(
      conflictId,
    );
  }

  async saveResolved(
    value: ResolvedConflict,
  ): Promise<void> {
    this.resolved.set(
      value.conflictId,
      value,
    );

    const current =
      this.conflicts.get(
        value.conflictId,
      );

    if (current) {
      this.conflicts.set(
        value.conflictId,
        {
          ...current,
          state: "merged",
          resolvedAt:
            value.resolvedAt,
        },
      );
    }
  }
}

export class InMemoryConflictResolutionItemRepository
implements ConflictResolutionItemRepository {
  private readonly values =
    new Map<string, PersonalKnowledgeItem>();

  async save(
    item: PersonalKnowledgeItem,
  ): Promise<void> {
    this.values.set(
      item.itemId,
      item,
    );
  }

  get(itemId: string) {
    return this.values.get(itemId);
  }
}

export class PassthroughConflictResolutionUnitOfWork
implements ConflictResolutionUnitOfWork {
  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    return work();
  }
}
