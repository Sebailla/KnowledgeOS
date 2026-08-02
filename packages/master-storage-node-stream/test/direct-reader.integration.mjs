import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  InMemoryMasterStorageCatalog,
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import {
  DirectMasterStorageReader,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-direct-reader-"),
);

try {
  const catalog =
    new InMemoryMasterStorageCatalog();
  const storage =
    new MasterPublicationStorage(root, catalog);

  const staged = await storage.stage(
    Buffer.from("0123456789abcdefghijklmnopqrstuvwxyz"),
    "application/octet-stream",
  );

  const stored = await storage.commit({
    publicationId: "publication:direct-0001",
    versionId: "version:direct-0001",
    sourceItemId: "source-item:direct-0001",
    staged,
  });

  const reader = new DirectMasterStorageReader(
    root,
    catalog,
  );

  const full = await reader.open(
    stored.publicationId,
    stored.versionId,
  );

  const fullChunks = [];
  for await (const chunk of full.stream) {
    fullChunks.push(chunk);
  }

  assert.equal(
    Buffer.concat(fullChunks).toString("utf8"),
    "0123456789abcdefghijklmnopqrstuvwxyz",
  );

  const ranged = await reader.open(
    stored.publicationId,
    stored.versionId,
    {
      start: 10,
      endInclusive: 15,
    },
  );

  const rangeChunks = [];
  for await (const chunk of ranged.stream) {
    rangeChunks.push(chunk);
  }

  assert.equal(
    Buffer.concat(rangeChunks).toString("utf8"),
    "abcdef",
  );
  assert.equal(ranged.contentLength, 6);

  console.log(JSON.stringify({
    flow: "direct-filesystem-full-and-range-read",
    status: "passed",
    fullLength: full.contentLength,
    rangeLength: ranged.contentLength,
  }));
} finally {
  await rm(root, { recursive: true, force: true });
}
