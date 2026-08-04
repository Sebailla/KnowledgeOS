import { ExportError } from "./ExportError.js";

export class ExportFormatError extends ExportError {
  public constructor(format: string) {
    super(
      `No export transformer is registered for format '${format}'.`,
      "EXPORT_FORMAT_UNSUPPORTED",
    );
  }
}
