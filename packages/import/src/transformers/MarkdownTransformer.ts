import type { ImportTransformer } from "../contracts/ImportTransformer.js";
import type { ImportDocument } from "../model/ImportDocument.js";
import type { ImportSource } from "../model/ImportSource.js";

export class MarkdownTransformer implements ImportTransformer {
  public readonly format = "markdown";

  public async transform(
    source: ImportSource,
    raw: string,
  ): Promise<ImportDocument> {
    const title =
      raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ??
      source.name;

    return {
      id: source.id,
      title,
      body: raw,
      format: this.format,
      metadata: normalizeMetadata(source.metadata),
      tags: ["markdown"],
    };
  }
}

function normalizeMetadata(
  metadata: Readonly<Record<string, unknown>>,
): Readonly<Record<string, string | number | boolean>> {
  return Object.fromEntries(
    Object.entries(metadata).filter(
      (
        entry,
      ): entry is [string, string | number | boolean] =>
        ["string", "number", "boolean"].includes(
          typeof entry[1],
        ),
    ),
  );
}
