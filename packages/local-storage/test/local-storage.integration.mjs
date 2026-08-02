import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  LocalFilesystemContentStore,
  LocalStorageScanner,
  sha256,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-local-storage-"),
);

try {
  const storage =
    new LocalFilesystemContentStore(root);

  const bytes = Buffer.from(
    "persistent local bytes",
  );
  const staged =
    await storage.stage(bytes);
  const committed =
    await storage.commit(staged);

  assert.equal(
    await storage.verify(
      committed.relativePath,
      sha256(bytes),
      bytes.byteLength,
    ),
    true,
  );

  const read = await storage.read(
    committed.relativePath,
  );
  assert.equal(
    Buffer.from(read).toString("utf8"),
    "persistent local bytes",
  );

  const scanned =
    await new LocalStorageScanner(
      root,
    ).scan();

  assert.equal(scanned.length, 1);

  console.log(JSON.stringify({
    flow:
      "local-filesystem-stage-commit-read-scan",
    status: "passed",
    objects: scanned.length,
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
