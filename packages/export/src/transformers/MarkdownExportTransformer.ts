import type {
  ExportContext,
  ExportTransformer,
} from "../contracts/ExportTransformer.js";
import type { ExportArtifact } from "../model/ExportArtifact.js";
import type { ExportSource } from "../model/ExportSource.js";

export class MarkdownExportTransformer
implements ExportTransformer {
  public readonly format = "markdown" as const;

  public async transform(
    source: ExportSource,
    context: ExportContext,
  ): Promise<ExportArtifact> {
    context.cancellation.throwIfCancellationRequested();

    const frontmatter = [
      "---",
      `id: ${source.id}`,
      `title: ${JSON.stringify(source.title)}`,
      "---",
      "",
    ].join("\n");

    return {
      id: `${source.id}:markdown`,
      format: this.format,
      mediaType: "text/markdown",
      fileName: `${sanitize(source.title)}.md`,
      content: `${frontmatter}# ${source.title}\n\n${source.body}\n`,
      metadata: source.metadata,
    };
  }
}

function sanitize(value: string): string {
  const normalized = value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "document";
}
