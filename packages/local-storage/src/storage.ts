import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import type {
  LocalContentStore,
} from "@knowledgeos/local-library";
import { sha256 } from "./checksum.js";
import {
  createLocalStoragePaths,
  objectRelativePath,
} from "./path-policy.js";

export class LocalFilesystemContentStore
implements LocalContentStore {
  private readonly paths;

  public constructor(private readonly root: string) {
    this.paths = createLocalStoragePaths(root);
  }

  async initialize(): Promise<void> {
    await Promise.all([
      mkdir(this.paths.objects, { recursive: true }),
      mkdir(this.paths.staging, { recursive: true }),
      mkdir(this.paths.quarantine, { recursive: true }),
    ]);
  }

  async stage(data: Uint8Array) {
    await this.initialize();

    const fingerprint = sha256(data);
    const stagingId = randomUUID();
    const temporaryPath = join(
      this.paths.staging,
      `${stagingId}.part`,
    );

    await writeFile(temporaryPath, data);
    const metadata = await stat(temporaryPath);

    return {
      stagingId,
      temporaryPath,
      contentFingerprint: fingerprint,
      byteLength: metadata.size,
    };
  }

  async commit(staged: {
    readonly stagingId: string;
    readonly temporaryPath: string;
    readonly contentFingerprint: string;
    readonly byteLength: number;
  }): Promise<{
    readonly relativePath: string;
  }> {
    const relativePath =
      objectRelativePath(
        staged.contentFingerprint,
      );
    const target = join(
      this.root,
      relativePath,
    );

    await mkdir(
      dirname(target),
      { recursive: true },
    );

    if (await this.exists(target)) {
      const existing = await readFile(target);
      if (
        sha256(existing) !==
        staged.contentFingerprint
      ) {
        throw new Error(
          "Existing local object checksum mismatch",
        );
      }

      await rm(
        staged.temporaryPath,
        { force: true },
      );
      return { relativePath };
    }

    await rename(
      staged.temporaryPath,
      target,
    );

    return { relativePath };
  }

  async read(
    relativePath: string,
  ): Promise<Uint8Array> {
    return readFile(
      join(this.root, relativePath),
    );
  }

  async delete(
    relativePath: string,
  ): Promise<void> {
    await rm(
      join(this.root, relativePath),
      { force: true },
    );
  }

  async verify(
    relativePath: string,
    expectedFingerprint: string,
    expectedByteLength: number,
  ): Promise<boolean> {
    try {
      const path = join(
        this.root,
        relativePath,
      );
      const metadata = await stat(path);
      if (
        !metadata.isFile() ||
        metadata.size !== expectedByteLength
      ) {
        return false;
      }

      const bytes = await readFile(path);
      return sha256(bytes) ===
        expectedFingerprint;
    } catch {
      return false;
    }
  }

  private async exists(
    path: string,
  ): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }
}
