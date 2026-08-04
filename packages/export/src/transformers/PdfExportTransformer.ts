import type {
  ExportContext,
  ExportTransformer,
} from "../contracts/ExportTransformer.js";
import type { ExportArtifact } from "../model/ExportArtifact.js";
import type { ExportSource } from "../model/ExportSource.js";
import { ExportError } from "../errors/ExportError.js";

export class PdfExportTransformer
implements ExportTransformer {
  public readonly format = "pdf" as const;

  public async transform(
    _source: ExportSource,
    _context: ExportContext,
  ): Promise<ExportArtifact> {
    throw new ExportError(
      "PDF export requires a renderer provider.",
      "EXPORT_RENDERER_REQUIRED",
    );
  }
}
