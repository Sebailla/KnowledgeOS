import type {
  ExportContext,
  ExportTransformer,
} from "../contracts/ExportTransformer.js";
import type { ExportArtifact } from "../model/ExportArtifact.js";
import type { ExportSource } from "../model/ExportSource.js";

export class HtmlExportTransformer
implements ExportTransformer {
  public readonly format = "html" as const;

  public async transform(
    source: ExportSource,
    context: ExportContext,
  ): Promise<ExportArtifact> {
    context.cancellation.throwIfCancellationRequested();

    const content = [
      "<!doctype html>",
      '<html lang="en">',
      "<head>",
      '  <meta charset="utf-8">',
      `  <title>${escapeHtml(source.title)}</title>`,
      "</head>",
      "<body>",
      `  <article data-knowledge-id="${escapeHtml(source.id)}">`,
      `    <h1>${escapeHtml(source.title)}</h1>`,
      `    <div>${escapeHtml(source.body).replace(/\n/g, "<br>")}</div>`,
      "  </article>",
      "</body>",
      "</html>",
    ].join("\n");

    return {
      id: `${source.id}:html`,
      format: this.format,
      mediaType: "text/html",
      fileName: `${sanitize(source.title)}.html`,
      content,
      metadata: source.metadata,
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitize(value: string): string {
  const normalized = value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "document";
}
