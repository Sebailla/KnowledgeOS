import type { ExportArtifact } from "../model/ExportArtifact.js";

export interface ExportWriter {
  write(artifact: ExportArtifact): Promise<void>;
}
