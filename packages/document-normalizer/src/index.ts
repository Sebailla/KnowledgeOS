import type {
  DocumentBlock,
  ParsedDocument,
} from "@knowledgeos/document-contracts";

export class DocumentNormalizer {
  normalize(document: ParsedDocument): ParsedDocument {
    const blocks =
      document.blocks
        .map((block) => this.normalizeBlock(block))
        .filter((block) => {
          if (block.type === "paragraph" || block.type === "heading") {
            return Boolean(block.text?.trim());
          }
          return true;
        })
        .map((block, index) => ({
          ...block,
          order: index,
        }));

    return {
      ...document,
      title:
        document.title?.trim() ||
        blocks.find((block) => block.type === "heading")?.text ||
        deriveTitle(document.source.uri),
      blocks,
      metadata: sortRecord(document.metadata),
    };
  }

  private normalizeBlock(
    block: DocumentBlock,
  ): DocumentBlock {
    return {
      ...block,
      ...(block.text === undefined
        ? {}
        : {
            text: block.text
              .normalize("NFKC")
              .replace(/\s+/g, " ")
              .trim(),
          }),
      metadata: sortRecord(block.metadata),
    };
  }
}

function deriveTitle(uri: string): string {
  const value = uri.split("/").pop() ?? uri;
  return value.replace(/\.[^.]+$/, "");
}

function sortRecord(
  value: Readonly<Record<string, string | number | boolean>>,
) {
  return Object.fromEntries(
    Object.entries(value).sort(([a], [b]) => a.localeCompare(b)),
  );
}
