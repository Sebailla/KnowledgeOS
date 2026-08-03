import type {
  KnowledgeObjectId,
  Page,
  PageRequest,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";

export interface MasterCatalogRecord {
  readonly publicationId: PublicationId;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly title: string;
  readonly authors: readonly string[];
  readonly versionId: VersionId;
  readonly format?: string;
}

export interface MasterCatalogSearch extends PageRequest {
  readonly search?: string;
  readonly format?: string;
}

export interface MasterCatalogReader {
  browse(parameters: MasterCatalogSearch): Promise<Page<MasterCatalogRecord>>;
  get(publicationId: PublicationId): Promise<MasterCatalogRecord | undefined>;
}
