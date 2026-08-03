import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ChunkBlobStore } from "@knowledgeos/master-resumable-upload-postgres";

export class FilesystemChunkBlobStore implements ChunkBlobStore {
  public constructor(private readonly root: string) {}
  private dir(sessionId: string): string { return join(this.root, sessionId); }
  private file(sessionId: string, index: number): string { return join(this.dir(sessionId), `${index.toString().padStart(8,"0")}.part`); }
  async saveChunk(sessionId: string, index: number, bytes: Uint8Array): Promise<string> {
    await mkdir(this.dir(sessionId), { recursive: true });
    const target = this.file(sessionId, index); const temp = `${target}.tmp`;
    await writeFile(temp, bytes); await rename(temp, target); return target;
  }
  readChunk(sessionId: string, index: number): Promise<Uint8Array> { return readFile(this.file(sessionId,index)); }
  deleteSession(sessionId: string): Promise<void> { return rm(this.dir(sessionId), { recursive: true, force: true }); }
}
