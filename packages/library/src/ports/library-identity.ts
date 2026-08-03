import type {
  AcquisitionId,
  KnowledgeObjectId,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface LibraryIdentityService {
  knowledgeObjectId(): KnowledgeObjectId;
  publicationId(): PublicationId;
  acquisitionId(): AcquisitionId;
  versionId(): VersionId;
}
