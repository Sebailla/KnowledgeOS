import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import type {
  UploadChunkRecord,
  UploadSession,
} from "./model.js";

export interface UploadSessionStore {
  create(session: UploadSession): Promise<void>;
  get(sessionId: string): Promise<UploadSession | undefined>;
  save(session: UploadSession): Promise<void>;
  saveChunk(
    sessionId: string,
    record: UploadChunkRecord,
    bytes: Uint8Array,
  ): Promise<void>;
  readChunk(
    sessionId: string,
    index: number,
  ): Promise<Uint8Array>;
  delete(sessionId: string): Promise<void>;
  list(): Promise<readonly UploadSession[]>;
}

export class FileUploadSessionStore
implements UploadSessionStore {
  public constructor(private readonly root: string) {}

  private sessionPath(sessionId: string): string {
    return join(this.root, sessionId);
  }

  private metadataPath(sessionId: string): string {
    return join(
      this.sessionPath(sessionId),
      "session.json",
    );
  }

  private chunkPath(
    sessionId: string,
    index: number,
  ): string {
    return join(
      this.sessionPath(sessionId),
      "chunks",
      `${index.toString().padStart(8, "0")}.part`,
    );
  }

  async create(session: UploadSession): Promise<void> {
    const path = this.sessionPath(session.sessionId);
    try {
      await access(path);
      throw new Error(
        `Upload session already exists: ${session.sessionId}`,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(
          "Upload session already exists",
        )
      ) {
        throw error;
      }
    }

    await mkdir(
      join(path, "chunks"),
      { recursive: true },
    );
    await this.save(session);
  }

  async get(
    sessionId: string,
  ): Promise<UploadSession | undefined> {
    try {
      const raw = await readFile(
        this.metadataPath(sessionId),
      );
      return JSON.parse(
        raw.toString("utf8"),
      ) as UploadSession;
    } catch {
      return undefined;
    }
  }

  async save(session: UploadSession): Promise<void> {
    const path = this.sessionPath(session.sessionId);
    await mkdir(path, { recursive: true });

    const temp = join(path, "session.json.tmp");
    const final = this.metadataPath(session.sessionId);

    await writeFile(
      temp,
      JSON.stringify(session, null, 2),
    );
    await rename(temp, final);
  }

  async saveChunk(
    sessionId: string,
    record: UploadChunkRecord,
    bytes: Uint8Array,
  ): Promise<void> {
    const path = this.chunkPath(
      sessionId,
      record.index,
    );
    await mkdir(
      join(this.sessionPath(sessionId), "chunks"),
      { recursive: true },
    );
    await writeFile(path, bytes);
  }

  async readChunk(
    sessionId: string,
    index: number,
  ): Promise<Uint8Array> {
    return readFile(this.chunkPath(sessionId, index));
  }

  async delete(sessionId: string): Promise<void> {
    await rm(
      this.sessionPath(sessionId),
      { recursive: true, force: true },
    );
  }

  async list(): Promise<readonly UploadSession[]> {
    await mkdir(this.root, { recursive: true });
    const entries = await readdir(
      this.root,
      { withFileTypes: true },
    );
    const sessions: UploadSession[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const session = await this.get(entry.name);
      if (session) sessions.push(session);
    }

    return sessions;
  }
}
