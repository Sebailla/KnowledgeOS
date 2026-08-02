import {
  readdir,
  stat,
} from "node:fs/promises";
import { join } from "node:path";
import {
  createLocalStoragePaths,
} from "./path-policy.js";

export interface ScannedLocalObject {
  readonly relativePath: string;
  readonly byteLength: number;
}

async function walk(
  root: string,
): Promise<readonly string[]> {
  const entries = await readdir(
    root,
    { withFileTypes: true },
  );
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }

  return files;
}

export class LocalStorageScanner {
  public constructor(
    private readonly root: string,
  ) {}

  async scan(): Promise<
    readonly ScannedLocalObject[]
  > {
    const paths =
      createLocalStoragePaths(this.root);
    const files =
      await walk(paths.objects);

    const result: ScannedLocalObject[] = [];

    for (const file of files) {
      const metadata = await stat(file);
      result.push({
        relativePath:
          file.slice(this.root.length + 1),
        byteLength:
          metadata.size,
      });
    }

    return result.sort((a, b) =>
      a.relativePath.localeCompare(
        b.relativePath,
      ),
    );
  }
}
