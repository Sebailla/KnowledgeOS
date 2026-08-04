import { ImportError } from "./ImportError.js";

export class UnsupportedFormatError extends ImportError {
  public constructor(format: string) {
    super(
      `Unsupported import format '${format}'.`,
      "IMPORT_FORMAT_UNSUPPORTED",
    );
  }
}
