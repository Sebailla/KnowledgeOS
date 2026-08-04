import type {
  ExportContext,
  ExportTransformer,
} from "../contracts/ExportTransformer.js";
import type { ExportArtifact } from "../model/ExportArtifact.js";
import type { ExportSource } from "../model/ExportSource.js";
import { ExportError } from "../errors/ExportError.js";

export class EpubExportTransformer
implements ExportTransformer {
  public readonly format = "epub" as const;

  public async transform(
    _source: ExportSource,
    _context: ExportContext,
  ): Promise<ExportArtifact> {
    throw new ExportError(
      "EPUB export requires a packaging provider.",
      "EXPORT_PACKAGER_REQUIRED",
    );
  }
}
