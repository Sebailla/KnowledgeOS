import type {
  BrowseMasterCatalogQuery,
  BrowseMasterCatalogResult,
  PublicationSummary,
} from "@knowledgeos/contracts";
import type { QueryHandler, ExecutionContext } from "@knowledgeos/kernel";
import type { MasterCatalogReader } from "../ports/catalog.js";

export class BrowseMasterCatalogHandler
implements QueryHandler<BrowseMasterCatalogQuery, BrowseMasterCatalogResult> {
  public constructor(private readonly catalog: MasterCatalogReader) {}

  async handle(
    query: BrowseMasterCatalogQuery,
    _context: ExecutionContext,
  ): Promise<BrowseMasterCatalogResult> {
    const page = await this.catalog.browse(query.parameters);
    return {
      ...page,
      items: page.items.map<PublicationSummary>((item) => ({
        publicationId: item.publicationId,
        knowledgeObjectId: item.knowledgeObjectId,
        title: item.title,
        authors: item.authors,
        versionId: item.versionId,
        availability: {
          state: "remote-available",
          readableOffline: false,
          acquisitionRequired: true,
        },
      })),
    };
  }
}
