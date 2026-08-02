import type {
  GetLocalAvailabilityQuery,
  LocalAvailabilityResult,
} from "@knowledgeos/contracts";
import type { LocalLibraryRepository } from "@knowledgeos/domain";
import type { QueryHandler, ExecutionContext } from "@knowledgeos/kernel";
import { libraryNotFound } from "../errors.js";

export class GetLocalAvailabilityHandler
implements QueryHandler<GetLocalAvailabilityQuery, LocalAvailabilityResult> {
  public constructor(private readonly libraries: LocalLibraryRepository) {}

  async handle(
    query: GetLocalAvailabilityQuery,
    _context: ExecutionContext,
  ): Promise<LocalAvailabilityResult> {
    const library = await this.libraries.get(query.parameters.localLibraryId);
    if (!library) throw libraryNotFound(query.parameters.localLibraryId);
    const membership = library.getMembership(query.parameters.knowledgeObjectId);
    if (!membership) {
      return {
        localLibraryId: query.parameters.localLibraryId,
        knowledgeObjectId: query.parameters.knowledgeObjectId,
        availability: {
          state: "unavailable",
          readableOffline: false,
          acquisitionRequired: true,
        },
      };
    }
    return {
      localLibraryId: query.parameters.localLibraryId,
      knowledgeObjectId: query.parameters.knowledgeObjectId,
      sourceItemId: membership.sourceItemId,
      sourceVersionId: membership.sourceVersionId,
      availability: {
        state:
          membership.state === "available" ? "local-available" : membership.state,
        readableOffline: membership.state === "available",
        acquisitionRequired: membership.state === "evicted",
      },
    };
  }
}
