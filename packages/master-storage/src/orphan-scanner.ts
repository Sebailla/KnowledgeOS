import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type {
  MasterStorageCatalog,
} from "./catalog.js";
import type {
  OrphanedStorageObject,
} from "./model.js";
import {
  createStoragePaths,
} from "./path-policy.js";

async function walk(root: string): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }

  return files;
}

export class OrphanScanner {
  public constructor(
    private readonly root: string,
    private readonly catalog: MasterStorageCatalog,
  ) {}

  async scan(): Promise<readonly OrphanedStorageObject[]> {
    const paths = createStoragePaths(this.root);
    const known = new Set(
      (await this.catalog.listAll()).map(
        (value) => join(this.root, value.relativePath),
      ),
    );

    const files = await walk(paths.objects);
    const orphans: OrphanedStorageObject[] = [];

    for (const file of files) {
      if (known.has(file)) continue;
      const metadata = await stat(file);
      orphans.push({
        relativePath: file.slice(this.root.length + 1),
        byteLength: metadata.size,
      });
    }

    return orphans;
  }
}
