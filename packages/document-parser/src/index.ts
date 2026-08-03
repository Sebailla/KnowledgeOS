import type {
  DocumentFormat,
  DocumentParser,
  DocumentParserRegistry,
  ParsedDocument,
} from "@knowledgeos/document-contracts";

export function detectDocumentFormat(
  mimeType: string,
  sourceUri: string,
): DocumentFormat {
  const mime = mimeType.toLowerCase();
  const uri = sourceUri.toLowerCase();

  if (mime.includes("pdf") || uri.endsWith(".pdf")) return "pdf";
  if (mime.includes("epub") || uri.endsWith(".epub")) return "epub";
  if (mime.includes("markdown") || uri.endsWith(".md")) return "markdown";
  if (mime.includes("html") || uri.endsWith(".html") || uri.endsWith(".htm")) return "html";
  if (mime.includes("wordprocessingml") || uri.endsWith(".docx")) return "docx";
  if (mime.startsWith("text/") || uri.endsWith(".txt")) return "text";
  if (mime.startsWith("image/")) return "image";
  return "unknown";
}

export class DefaultDocumentParserRegistry
implements DocumentParserRegistry {
  private readonly parsers =
    new Map<DocumentFormat, DocumentParser>();

  register(parser: DocumentParser): void {
    for (const format of parser.formats) {
      if (this.parsers.has(format)) {
        throw new Error(`Parser already registered for ${format}`);
      }
      this.parsers.set(format, parser);
    }
  }

  resolve(format: DocumentFormat): DocumentParser {
    const parser = this.parsers.get(format);
    if (!parser) {
      throw new Error(`No parser registered for ${format}`);
    }
    return parser;
  }
}

export class PlainTextDocumentParser
implements DocumentParser {
  readonly formats = [
    "text",
    "markdown",
    "html",
  ] as const;

  async parse(
    input: {
      readonly documentId: string;
      readonly sourceUri: string;
      readonly mimeType: string;
      readonly bytes: Uint8Array;
      readonly importedAt: string;
    },
  ): Promise<ParsedDocument> {
    const text = decodeUtf8(input.bytes);
    const lines: string[] = text.split(/\r?\n/);
    const blocks = lines
      .map((line: string, index: number) => {
        const heading = /^(#{1,6})\s+(.*)$/.exec(line);
        return heading
          ? {
              blockId: `${input.documentId}:block:${index}`,
              type: "heading" as const,
              text: heading[2] ?? "",
              level: (heading[1] ?? "").length,
              order: index,
              metadata: {},
            }
          : {
              blockId: `${input.documentId}:block:${index}`,
              type: "paragraph" as const,
              text: stripHtml(line),
              order: index,
              metadata: {},
            };
      })
      .filter((block: { readonly text?: string }) =>
        (block.text ?? "").trim().length > 0,
      );

    const fingerprint = simpleFingerprint(input.bytes);

    return {
      documentId: input.documentId,
      source: {
        sourceId: `${input.documentId}:source`,
        uri: input.sourceUri,
        format: detectDocumentFormat(input.mimeType, input.sourceUri),
        mimeType: input.mimeType,
        sizeBytes: input.bytes.byteLength,
        contentFingerprint: fingerprint,
        importedAt: input.importedAt,
      },
      blocks,
      assets: [],
      metadata: {},
      createdAt: input.importedAt,
    };
  }
}

function decodeUtf8(bytes: Uint8Array): string {
  let output = "";
  for (let index = 0; index < bytes.length; index += 1) {
    const first = bytes[index] ?? 0;
    if (first < 0x80) {
      output += String.fromCodePoint(first);
      continue;
    }
    if ((first & 0xe0) === 0xc0) {
      const second = bytes[++index] ?? 0;
      output += String.fromCodePoint(((first & 0x1f) << 6) | (second & 0x3f));
      continue;
    }
    if ((first & 0xf0) === 0xe0) {
      const second = bytes[++index] ?? 0;
      const third = bytes[++index] ?? 0;
      output += String.fromCodePoint(
        ((first & 0x0f) << 12) |
          ((second & 0x3f) << 6) |
          (third & 0x3f),
      );
      continue;
    }
    const second = bytes[++index] ?? 0;
    const third = bytes[++index] ?? 0;
    const fourth = bytes[++index] ?? 0;
    output += String.fromCodePoint(
      ((first & 0x07) << 18) |
        ((second & 0x3f) << 12) |
        ((third & 0x3f) << 6) |
        (fourth & 0x3f),
    );
  }
  return output;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").trim();
}

function simpleFingerprint(bytes: Uint8Array): string {
  let hash = 2166136261;
  for (const value of bytes) {
    hash ^= value;
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
