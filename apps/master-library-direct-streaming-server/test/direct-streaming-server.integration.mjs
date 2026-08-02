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
} from "@knowledgeos/master-storage-node-stream";
import {
  MasterDirectStreamingServer,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-direct-server-"),
);

try {
  const catalog =
    new InMemoryMasterStorageCatalog();
  const storage =
    new MasterPublicationStorage(root, catalog);

  const bytes = Buffer.from(
    "direct filesystem streaming response",
  );
  const staged = await storage.stage(
    bytes,
    "application/pdf",
  );
  const stored = await storage.commit({
    publicationId: "publication:direct-server-0001",
    versionId: "version:direct-server-0001",
    sourceItemId: "source-item:direct-server-0001",
    staged,
  });

  const server = new MasterDirectStreamingServer(
    {
      reader: new DirectMasterStorageReader(
        root,
        catalog,
      ),
    },
    {
      host: "127.0.0.1",
      port: 0,
    },
  );

  const address = await server.start();
  const url =
    `http://${address.host}:${address.port}` +
    "/v1/master-library/publications/" +
    encodeURIComponent(stored.publicationId) +
    "/versions/" +
    encodeURIComponent(stored.versionId) +
    "/content";

  try {
    const full = await fetch(url);
    assert.equal(full.status, 200);
    assert.equal(
      Buffer.from(
        await full.arrayBuffer(),
      ).toString("utf8"),
      "direct filesystem streaming response",
    );

    const range = await fetch(url, {
      headers: {
        range: "bytes=7-16",
      },
    });
    assert.equal(range.status, 206);
    assert.equal(
      Buffer.from(
        await range.arrayBuffer(),
      ).toString("utf8"),
      "filesystem",
    );

    const head = await fetch(url, {
      method: "HEAD",
    });
    assert.equal(head.status, 200);
    assert.equal(
      Number(head.headers.get("content-length")),
      bytes.byteLength,
    );

    const etag = full.headers.get("etag");
    const cached = await fetch(url, {
      headers: {
        "if-none-match": etag,
      },
    });
    assert.equal(cached.status, 304);

    console.log(JSON.stringify({
      flow:
        "direct-filesystem-http-stream-range-head-etag",
      status: "passed",
      byteLength: bytes.byteLength,
    }));
  } finally {
    await server.stop();
  }
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
