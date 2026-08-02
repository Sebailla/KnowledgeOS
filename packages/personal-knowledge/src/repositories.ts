import type {
  PersonalKnowledgeItem,
  PersonalKnowledgeRevision,
} from "./model.js";

export interface PersonalKnowledgeRepository {
  get(itemId: string): Promise<PersonalKnowledgeItem | undefined>;
  save(item: PersonalKnowledgeItem): Promise<void>;
  listByKnowledgeObject(
    knowledgeObjectId: string,
    includeDeleted?: boolean,
  ): Promise<readonly PersonalKnowledgeItem[]>;
}

export interface PersonalKnowledgeRevisionRepository {
  append(
    revision: PersonalKnowledgeRevision,
  ): Promise<void>;
  list(
    itemId: string,
  ): Promise<readonly PersonalKnowledgeRevision[]>;
}

export interface PersonalKnowledgeUnitOfWork {
  run<T>(
    work: () => Promise<T>,
  ): Promise<T>;
}
