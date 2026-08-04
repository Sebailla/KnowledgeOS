import type { ImportTransformer } from "../contracts/ImportTransformer.js";
import type { ImportDocument } from "../model/ImportDocument.js";
import type { ImportSource } from "../model/ImportSource.js";

export class TextTransformer implements ImportTransformer {
  public readonly format = "text";

  public async transform(
    source: ImportSource,
    raw: string,
  ): Promise<ImportDocument> {
    return {
      id: source.id,
      title: source.name,
      body: raw,
      format: this.format,
      metadata: {},
      tags: ["text"],
    };
  }
}
