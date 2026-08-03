import type {
  AcquisitionId,
  KnowledgeObjectId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type { IdGenerator } from "@knowledgeos/kernel";
import type { LibraryIdentityService } from "../ports/library-identity.js";

export class KernelLibraryIdentityService implements LibraryIdentityService {
  private versionSequence = 0;
  public constructor(private readonly ids: IdGenerator) {}
  knowledgeObjectId(): KnowledgeObjectId {
    return this.ids.operationId().replace("operation:", "knowledge-object:") as KnowledgeObjectId;
  }
  publicationId(): PublicationId {
    return this.ids.operationId().replace("operation:", "publication:") as PublicationId;
  }
  acquisitionId(): AcquisitionId {
    return this.ids.operationId().replace("operation:", "acquisition:") as AcquisitionId;
  }
  versionId(): VersionId {
    this.versionSequence += 1;
    return `version:${this.ids.operationId()}:${this.versionSequence}` as VersionId;
  }
}
