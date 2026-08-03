import {
  access,
  mkdir,
  open,
  readFile,
  readdir,
  rm,
  stat,
} from "node:fs/promises";
import { join } from "node:path";
import type {
  ResumableLocalStaging,
} from "@knowledgeos/sync-local-runtime";

export interface StagingRecoveryEntry {
  readonly transferId: string;
  readonly temporaryPath: string;
  readonly byteLength: number;
}

export class FilesystemResumableLocalStaging
implements ResumableLocalStaging {
  public constructor(
    private readonly root: string,
  ) {}

  private path(
    transferId: string,
  ): string {
    return join(
      this.root,
      `${encodeURIComponent(transferId)}.part`,
    );
  }

  async ensure(
    transferId: string,
  ) {
    await mkdir(
      this.root,
      { recursive: true },
    );

    const path =
      this.path(transferId);

    if (!(await this.exists(path))) {
      const handle =
        await open(path, "wx");
      try {
        await handle.sync();
      } finally {
        await handle.close();
      }
    }

    const metadata =
      await stat(path);

    return {
      temporaryPath:
        path,
      byteLength:
        metadata.size,
    };
  }

  async append(
    transferId: string,
    expectedOffset: number,
    bytes: Uint8Array,
  ) {
    const current =
      await this.ensure(
        transferId,
      );

    if (
      current.byteLength !==
      expectedOffset
    ) {
      throw new Error(
        "Staging offset mismatch",
      );
    }

    const handle =
      await open(
        current.temporaryPath,
        "r+",
      );

    try {
      const result =
        await handle.write(
          bytes,
          0,
          bytes.byteLength,
          expectedOffset,
        );

      if (
        result.bytesWritten !==
        bytes.byteLength
      ) {
        throw new Error(
          "Incomplete staging write",
        );
      }

      await handle.sync();
    } finally {
      await handle.close();
    }

    const metadata =
      await stat(
        current.temporaryPath,
      );

    return {
      temporaryPath:
        current.temporaryPath,
      byteLength:
        metadata.size,
    };
  }

  async readAll(
    transferId: string,
  ): Promise<Uint8Array> {
    return readFile(
      this.path(transferId),
    );
  }

  async discard(
    transferId: string,
  ): Promise<void> {
    await rm(
      this.path(transferId),
      { force: true },
    );
  }

  async recover(): Promise<
    readonly StagingRecoveryEntry[]
  > {
    await mkdir(
      this.root,
      { recursive: true },
    );

    const entries =
      await readdir(
        this.root,
        { withFileTypes: true },
      );
    const result:
      StagingRecoveryEntry[] = [];

    for (const entry of entries) {
      if (
        !entry.isFile() ||
        !entry.name.endsWith(".part")
      ) {
        continue;
      }

      const path =
        join(this.root, entry.name);
      const metadata =
        await stat(path);

      result.push({
        transferId:
          decodeURIComponent(
            entry.name.slice(0, -5),
          ),
        temporaryPath:
          path,
        byteLength:
          metadata.size,
      });
    }

    return result.sort(
      (a, b) =>
        a.transferId.localeCompare(
          b.transferId,
        ),
    );
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
