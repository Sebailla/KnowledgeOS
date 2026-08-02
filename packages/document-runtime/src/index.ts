import type {
  ParsedDocument,
} from "@knowledgeos/document-contracts";
import {
  detectDocumentFormat,
  DefaultDocumentParserRegistry,
} from "@knowledgeos/document-parser";
import {
  DocumentNormalizer,
} from "@knowledgeos/document-normalizer";

export interface ParsedDocumentSink {
  save(
    document: ParsedDocument,
  ): Promise<void>;
}

export class DocumentProcessingRuntime {
  private readonly normalizer =
    new DocumentNormalizer();

  constructor(
    private readonly parsers:
      DefaultDocumentParserRegistry,
    private readonly sink:
      ParsedDocumentSink,
  ) {}

  async process(
    input: {
      readonly documentId: string;
      readonly sourceUri: string;
      readonly mimeType: string;
      readonly bytes: Uint8Array;
      readonly importedAt: string;
    },
  ): Promise<ParsedDocument> {
    const format =
      detectDocumentFormat(
        input.mimeType,
        input.sourceUri,
      );

    const parser =
      this.parsers.resolve(format);

    const parsed =
      await parser.parse(input);

    const normalized =
      this.normalizer.normalize(parsed);

    await this.sink.save(normalized);
    return normalized;
  }
}
