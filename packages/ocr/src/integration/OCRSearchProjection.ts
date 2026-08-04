import type { OCRDocument } from "../model/OCRDocument.js";

export interface OCRSearchDocument {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly metadata: Readonly<
    Record<string, string | number | boolean>
  >;
  readonly tags: readonly string[];
  readonly updatedAt: string;
}

export function ocrDocumentToSearchDocument(
  document: OCRDocument,
  title: string,
  updatedAt: string,
): OCRSearchDocument {
  return {
    id: `ocr:${document.sourceId}`,
    title,
    body: document.text,
    metadata: {
      type: "ocr-document",
      pages: document.pages.length,
    },
    tags: ["ocr"],
    updatedAt,
  };
}
