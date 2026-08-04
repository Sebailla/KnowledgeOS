import type { ExportWriter } from "../contracts/ExportWriter.js";
import type { ExportArtifact } from "../model/ExportArtifact.js";

export class InMemoryExportWriter
implements ExportWriter {
  private readonly artifacts =
    new Map<string, ExportArtifact>();

  public async write(
    artifact: ExportArtifact,
  ): Promise<void> {
    this.artifacts.set(artifact.id, artifact);
  }

  public get(
    artifactId: string,
  ): ExportArtifact | undefined {
    return this.artifacts.get(artifactId);
  }

  public list(): readonly ExportArtifact[] {
    return [...this.artifacts.values()];
  }
}
