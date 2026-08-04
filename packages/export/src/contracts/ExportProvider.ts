import type { ExportWriter } from "./ExportWriter.js";

export interface ExportProvider {
  readonly id: string;
  openWriter(): Promise<ExportWriter>;
  close(): Promise<void>;
}
