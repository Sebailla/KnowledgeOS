import type { ExportProvider } from "../contracts/ExportProvider.js";
import type { ExportWriter } from "../contracts/ExportWriter.js";
import { InMemoryExportWriter } from "./InMemoryExportWriter.js";

export class InMemoryExportProvider
implements ExportProvider {
  public readonly id = "in-memory";

  public constructor(
    public readonly writer =
      new InMemoryExportWriter(),
  ) {}

  public async openWriter(): Promise<ExportWriter> {
    return this.writer;
  }

  public async close(): Promise<void> {}
}
