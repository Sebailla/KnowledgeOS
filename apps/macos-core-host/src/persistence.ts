import { mkdir, readFile, rename, copyFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { env, cwd } from "node:process";

export interface PersistenceEnvelope<T> {
  readonly schemaVersion: 1;
  readonly updatedAt: string;
  readonly payload: T;
}

export interface PersistenceHealth {
  readonly status: "ok" | "recovered";
  readonly directory: string;
  readonly schemaVersion: 1;
  readonly recoveredFromBackup: boolean;
}

export class AtomicJsonStore<T> {
  private recoveredFromBackup = false;
  public constructor(
    public readonly filePath: string,
    private readonly fallback: T,
  ) {}

  public async read(): Promise<T> {
    await mkdir(dirname(this.filePath), { recursive: true });
    try { return await this.readEnvelope(this.filePath); }
    catch {
      try {
        const value = await this.readEnvelope(this.backupPath);
        this.recoveredFromBackup = true;
        await this.write(value);
        return value;
      } catch {
        await this.write(this.fallback);
        return this.fallback;
      }
    }
  }

  public async write(payload: T): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const envelope: PersistenceEnvelope<T> = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      payload,
    };
    try { await access(this.filePath); await copyFile(this.filePath, this.backupPath); } catch {}
    await writeFile(this.tempPath, JSON.stringify(envelope, null, 2) + "\n", "utf8");
    await rename(this.tempPath, this.filePath);
  }

  public async backup(destination: string): Promise<string> {
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(this.filePath, destination);
    return destination;
  }

  public async restore(source: string): Promise<void> {
    const payload = await this.readEnvelope(source);
    await this.write(payload);
  }

  public health(): PersistenceHealth {
    return {
      status: this.recoveredFromBackup ? "recovered" : "ok",
      directory: dirname(this.filePath),
      schemaVersion: 1,
      recoveredFromBackup: this.recoveredFromBackup,
    };
  }

  private async readEnvelope(path: string): Promise<T> {
    const parsed = JSON.parse(await readFile(path, "utf8")) as Partial<PersistenceEnvelope<T>>;
    if (parsed.schemaVersion !== 1 || parsed.payload === undefined) throw new Error("Invalid persistence envelope.");
    return parsed.payload;
  }
  private get tempPath(){ return `${this.filePath}.tmp`; }
  private get backupPath(){ return `${this.filePath}.bak`; }
}

export function defaultDataDirectory(): string {
  return env.KNOWLEDGEOS_DATA_DIR ?? join(cwd(), ".knowledgeos-data");
}
