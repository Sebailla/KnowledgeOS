import type {
  PersonalKnowledgeConflict,
} from "@knowledgeos/personal-knowledge-sync-model";
import type {
  PersonalKnowledgeItem,
} from "@knowledgeos/personal-knowledge";
import type {
  ResolvedConflict,
} from "./model.js";

export interface ConflictResolutionRepository {
  get(
    conflictId: string,
  ): Promise<PersonalKnowledgeConflict | undefined>;

  saveResolved(
    value: ResolvedConflict,
  ): Promise<void>;
}

export interface ConflictResolutionItemRepository {
  save(
    item: PersonalKnowledgeItem,
  ): Promise<void>;
}

export interface ConflictResolutionClock {
  nowIso(): string;
}

export interface ConflictResolutionUnitOfWork {
  run<T>(
    work: () => Promise<T>,
  ): Promise<T>;
}
