import type {
  MasterStorageCatalog,
} from "@knowledgeos/master-storage";

export interface ReconciliationIssue {
  readonly code:
    | "catalog-missing-object"
    | "object-missing-catalog"
    | "checksum-mismatch";
  readonly publicationId?: string;
  readonly versionId?: string;
  readonly relativePath?: string;
}

export interface StorageVerifier {
  verify(
    publicationId: never,
    versionId: never,
  ): Promise<boolean>;
}

export class MasterStorageReconciler {
  public constructor(
    private readonly catalog: MasterStorageCatalog,
    private readonly storage: StorageVerifier,
  ) {}

  async inspectCatalog(): Promise<readonly ReconciliationIssue[]> {
    const issues: ReconciliationIssue[] = [];

    for (const item of await this.catalog.listAll()) {
      const valid = await this.storage.verify(
        item.publicationId as never,
        item.versionId as never,
      );
      if (!valid) {
        issues.push({
          code: "catalog-missing-object",
          publicationId: item.publicationId,
          versionId: item.versionId,
          relativePath: item.relativePath,
        });
      }
    }

    return issues;
  }
}
