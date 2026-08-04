import type { ImportTransformer } from "../contracts/ImportTransformer.js";
import type { ImportDocument } from "../model/ImportDocument.js";
import type { ImportSource } from "../model/ImportSource.js";
import { ImportValidationError } from "../errors/ImportValidationError.js";

export class JsonTransformer implements ImportTransformer {
  public readonly format = "json";

  public async transform(
    source: ImportSource,
    raw: string,
  ): Promise<ImportDocument> {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new ImportValidationError([
        `Invalid JSON for source '${source.id}'.`,
      ]);
    }

    const object =
      typeof parsed === "object" &&
      parsed !== null
        ? parsed as Record<string, unknown>
        : {};

    const title =
      typeof object.title === "string"
        ? object.title
        : source.name;

    const body =
      typeof object.body === "string"
        ? object.body
        : JSON.stringify(parsed, null, 2);

    return {
      id: source.id,
      title,
      body,
      format: this.format,
      metadata: {},
      tags: ["json"],
    };
  }
}
