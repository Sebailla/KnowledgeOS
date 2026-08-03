export type DocumentFormat =
  | "pdf"
  | "epub"
  | "markdown"
  | "html"
  | "docx"
  | "text"
  | "image"
  | "unknown";

export interface DocumentSource {
  readonly sourceId: string;
  readonly uri: string;
  readonly format: DocumentFormat;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly contentFingerprint: string;
  readonly importedAt: string;
}

export interface DocumentAsset {
  readonly assetId: string;
  readonly sourceId: string;
  readonly kind:
    | "image"
    | "attachment"
    | "thumbnail"
    | "cover"
    | "font"
    | "other";
  readonly mimeType: string;
  readonly originalName?: string;
  readonly byteLength: number;
  readonly contentFingerprint: string;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface DocumentBlock {
  readonly blockId: string;
  readonly type:
    | "heading"
    | "paragraph"
    | "list"
    | "quote"
    | "code"
    | "table"
    | "image"
    | "page-break"
    | "unknown";
  readonly text?: string;
  readonly level?: number;
  readonly assetId?: string;
  readonly page?: number;
  readonly order: number;
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
}

export interface ParsedDocument {
  readonly documentId: string;
  readonly source: DocumentSource;
  readonly title?: string;
  readonly language?: string;
  readonly blocks: readonly DocumentBlock[];
  readonly assets: readonly DocumentAsset[];
  readonly metadata:
    Readonly<Record<string, string | number | boolean>>;
  readonly createdAt: string;
}
