import type {
  DocumentFormat,
  ParsedDocument,
} from "./model.js";

export interface DocumentParser {
  readonly formats:
    readonly DocumentFormat[];

  parse(
    input: {
      readonly documentId: string;
      readonly sourceUri: string;
      readonly mimeType: string;
      readonly bytes: Uint8Array;
      readonly importedAt: string;
    },
  ): Promise<ParsedDocument>;
}

export interface DocumentParserRegistry {
  register(parser: DocumentParser): void;
  resolve(format: DocumentFormat): DocumentParser;
}
