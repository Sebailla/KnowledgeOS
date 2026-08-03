import type { Page } from "@knowledgeos/domain-types";
import type {
  MasterCatalogReader,
  MasterCatalogRecord,
  MasterCatalogSearch,
} from "../ports/catalog.js";

export class InMemoryMasterCatalog implements MasterCatalogReader {
  private readonly records = new Map<string, MasterCatalogRecord>();

  add(record: MasterCatalogRecord): void {
    this.records.set(record.publicationId, record);
  }

  async get(publicationId: MasterCatalogRecord["publicationId"]): Promise<MasterCatalogRecord | undefined> {
    return this.records.get(publicationId);
  }

  async browse(parameters: MasterCatalogSearch): Promise<Page<MasterCatalogRecord>> {
    const search = parameters.search?.toLocaleLowerCase();
    const records = [...this.records.values()]
      .filter((record) => !parameters.format || record.format === parameters.format)
      .filter((record) => !search || record.title.toLocaleLowerCase().includes(search))
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, parameters.limit);
    return { items: records };
  }
}
