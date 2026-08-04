import type { FormatDetector } from "./contracts/FormatDetector.js";
import type { ImportSource } from "./model/ImportSource.js";
import { UnsupportedFormatError } from "./errors/UnsupportedFormatError.js";

const byExtension: Readonly<Record<string, string>> = {
  md: "markdown",
  markdown: "markdown",
  txt: "text",
  json: "json",
};

const byMediaType: Readonly<Record<string, string>> = {
  "text/markdown": "markdown",
  "text/plain": "text",
  "application/json": "json",
};

export class DefaultFormatDetector implements FormatDetector {
  public detect(source: ImportSource): string {
    if (source.mediaType) {
      const detected = byMediaType[source.mediaType.toLowerCase()];
      if (detected) return detected;
    }

    if (source.extension) {
      const normalized = source.extension
        .replace(/^\./, "")
        .toLowerCase();

      const detected = byExtension[normalized];
      if (detected) return detected;
    }

    throw new UnsupportedFormatError(
      source.mediaType ?? source.extension ?? "unknown",
    );
  }
}
