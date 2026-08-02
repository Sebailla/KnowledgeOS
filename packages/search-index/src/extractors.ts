import type {
  SearchDocument,
} from "@knowledgeos/search-domain";
import {
  normalizeSearchTerms,
  normalizeSearchText,
} from "@knowledgeos/search-domain";

export interface PublicationSearchSource {
  readonly searchDocumentId: string;
  readonly knowledgeObjectId: string;
  readonly publicationId: string;
  readonly versionId: string;
  readonly title: string;
  readonly text: string;
  readonly language?: string;
  readonly tags?: readonly string[];
  readonly authors?: readonly string[];
  readonly source?: string;
  readonly createdAt?: string;
  readonly updatedAt: string;
  readonly metadata?:
    Readonly<Record<string, string | number | boolean>>;
}

export interface PersonalKnowledgeSearchSource {
  readonly itemId: string;
  readonly knowledgeObjectId: string;
  readonly type: string;
  readonly body: string;
  readonly tags: readonly string[];
  readonly updatedAt: string;
  readonly deleted: boolean;
}

export class SearchDocumentExtractor {
  fromPublication(
    source:
      PublicationSearchSource,
  ): SearchDocument {
    return {
      searchDocumentId:
        source.searchDocumentId,
      knowledgeObjectId:
        source.knowledgeObjectId as never,
      publicationId:
        source.publicationId as never,
      versionId:
        source.versionId as never,
      kind:
        "publication",
      title:
        normalizeSearchText(
          source.title,
        ),
      body:
        normalizeSearchText(
          source.text,
        ),
      ...(source.language
        ? {
            language:
              normalizeSearchText(
                source.language,
              ),
          }
        : {}),
      tags:
        normalizeSearchTerms(
          source.tags ?? [],
        ),
      authors:
        normalizeSearchTerms(
          source.authors ?? [],
        ),
      ...(source.source
        ? {
            source:
              normalizeSearchText(
                source.source,
              ),
          }
        : {}),
      ...(source.createdAt
        ? {
            createdAt:
              source.createdAt,
          }
        : {}),
      updatedAt:
        source.updatedAt,
      deleted:
        false,
      metadata:
        source.metadata ?? {},
    };
  }

  fromPersonalKnowledge(
    source:
      PersonalKnowledgeSearchSource,
  ): SearchDocument {
    return {
      searchDocumentId:
        `personal-knowledge:${source.itemId}`,
      knowledgeObjectId:
        source.knowledgeObjectId as never,
      kind:
        "personal-knowledge",
      title:
        normalizeSearchText(
          source.type,
        ),
      body:
        normalizeSearchText(
          source.body,
        ),
      tags:
        normalizeSearchTerms(
          source.tags,
        ),
      authors:
        [],
      updatedAt:
        source.updatedAt,
      deleted:
        source.deleted,
      metadata: {
        itemId:
          source.itemId,
        personalKnowledgeType:
          source.type,
      },
    };
  }
}
