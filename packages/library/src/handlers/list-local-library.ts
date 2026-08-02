import type {
  ListLocalLibraryQuery,
  ListLocalLibraryResult,
  PublicationSummary,
} from "@knowledgeos/contracts";
import type {
  KnowledgeObjectRepository,
  LocalLibraryRepository,
  PublicationVersionRepository,
} from "@knowledgeos/domain";
import type { QueryHandler, ExecutionContext } from "@knowledgeos/kernel";
import { validatePageLimit } from "@knowledgeos/domain-types";
import { libraryNotFound } from "../errors.js";

export interface ListLocalLibraryDependencies {
  readonly libraries: LocalLibraryRepository;
  readonly knowledgeObjects: KnowledgeObjectRepository;
  readonly publications: PublicationVersionRepository;
}

export class ListLocalLibraryHandler
implements QueryHandler<ListLocalLibraryQuery, ListLocalLibraryResult> {
  public constructor(private readonly dependencies: ListLocalLibraryDependencies) {}

  async handle(
    query: ListLocalLibraryQuery,
    _context: ExecutionContext,
  ): Promise<ListLocalLibraryResult> {
    validatePageLimit(query.parameters.limit);
    const library = await this.dependencies.libraries.get(
      query.parameters.localLibraryId,
    );
    if (!library) throw libraryNotFound(query.parameters.localLibraryId);

    const memberships = library.listMemberships().slice(0, query.parameters.limit);
    const items: PublicationSummary[] = [];
    for (const membership of memberships) {
      const object = await this.dependencies.knowledgeObjects.get(
        membership.knowledgeObjectId,
      );
      if (!object) continue;
      const snapshot = object.snapshot();
      items.push({
        publicationId: `publication-for:${membership.knowledgeObjectId}` as never,
        knowledgeObjectId: membership.knowledgeObjectId,
        title: snapshot.title,
        authors: [],
        versionId: snapshot.currentVersionId ?? membership.sourceVersionId,
        availability: {
          state: membership.state === "available" ? "local-available" : membership.state,
          readableOffline: membership.state === "available",
          acquisitionRequired: membership.state === "evicted",
        },
      });
    }
    return { items };
  }
}
