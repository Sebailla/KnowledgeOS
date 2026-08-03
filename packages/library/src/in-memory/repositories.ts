import type {
  AcquisitionId,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
} from "@knowledgeos/domain-types";
import type {
  Acquisition,
  AcquisitionRepository,
  KnowledgeObject,
  KnowledgeObjectRepository,
  LocalLibrary,
  LocalLibraryRepository,
  PublicationVersion,
  PublicationVersionRepository,
  SourceItem,
  SourceItemRepository,
} from "@knowledgeos/domain";

abstract class MemoryRepository<Id, Value extends { readonly id: Id }> {
  protected readonly values = new Map<Id, Value>();
  async get(id: Id): Promise<Value | undefined> { return this.values.get(id); }
  async save(value: Value): Promise<void> { this.values.set(value.id, value); }
}

export class InMemoryKnowledgeObjectRepository
  extends MemoryRepository<KnowledgeObjectId, KnowledgeObject>
  implements KnowledgeObjectRepository {}

export class InMemorySourceItemRepository
  extends MemoryRepository<SourceItemId, SourceItem>
  implements SourceItemRepository {}

export class InMemoryLocalLibraryRepository
  extends MemoryRepository<LocalLibraryId, LocalLibrary>
  implements LocalLibraryRepository {}

export class InMemoryAcquisitionRepository
  extends MemoryRepository<AcquisitionId, Acquisition>
  implements AcquisitionRepository {}

export class InMemoryPublicationVersionRepository
implements PublicationVersionRepository {
  private readonly values = new Map<PublicationId, PublicationVersion>();
  async get(id: PublicationId): Promise<PublicationVersion | undefined> {
    return this.values.get(id);
  }
  async save(value: PublicationVersion): Promise<void> {
    this.values.set(value.id, value);
  }
}
