import type {
  DocumentAsset,
} from "@knowledgeos/document-contracts";

export interface DocumentAssetRepository {
  put(
    asset: DocumentAsset,
    bytes: Uint8Array,
  ): Promise<void>;

  get(
    assetId: string,
  ): Promise<
    { readonly asset: DocumentAsset; readonly bytes: Uint8Array } | undefined
  >;
}

export class InMemoryDocumentAssetRepository
implements DocumentAssetRepository {
  private readonly values =
    new Map<string, { asset: DocumentAsset; bytes: Uint8Array }>();

  async put(
    asset: DocumentAsset,
    bytes: Uint8Array,
  ): Promise<void> {
    if (bytes.byteLength !== asset.byteLength) {
      throw new Error("Asset byte length mismatch");
    }
    this.values.set(asset.assetId, {
      asset,
      bytes: new Uint8Array(bytes),
    });
  }

  async get(assetId: string) {
    const value = this.values.get(assetId);
    return value
      ? {
          asset: value.asset,
          bytes: new Uint8Array(value.bytes),
        }
      : undefined;
  }
}
