import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  InMemoryMasterPublicationRepository,
  InMemoryMasterPublicationVersionRepository,
  RegisterMasterPublicationService,
} from "@knowledgeos/master-library";
import {
  InMemoryMasterStorageCatalog,
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import {
  MasterRegistrationWorkflow,
} from "@knowledgeos/master-registration-workflow";
import {
  PassthroughUnitOfWork,
} from "@knowledgeos/kernel";
import {
  MasterLibraryStreamingServer,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-streaming-runtime-"),
);

const publications =
  new InMemoryMasterPublicationRepository();
const versions =
  new InMemoryMasterPublicationVersionRepository();
const registration =
  new RegisterMasterPublicationService(
    publications,
    versions,
    versions,
  );
const storage =
  new MasterPublicationStorage(
    root,
    new InMemoryMasterStorageCatalog(),
  );
const workflow =
  new MasterRegistrationWorkflow(
    storage,
    registration,
    new PassthroughUnitOfWork(),
    {
      async append() {
        return;
      },
    },
  );

const server = new MasterLibraryStreamingServer(
  {
    registration: workflow,
    publications,
    versions,
    storage,
  },
  {
    host: "127.0.0.1",
    port: 0,
    maximumUploadBytes: 1024 * 1024,
  },
);

const address = await server.start();
const baseUrl = `http://${address.host}:${address.port}`;

try {
  const bytes = Buffer.from(
    "streaming master library content",
  );

  const upload = await fetch(
    `${baseUrl}/v1/master-library/stream`,
    {
      method: "POST",
      headers: {
        "content-type": "application/pdf",
        "content-length": String(bytes.byteLength),
        "x-knowledgeos-publication-id":
          "publication:stream-0001",
        "x-knowledgeos-knowledge-object-id":
          "knowledge-object:stream-0001",
        "x-knowledgeos-source-item-id":
          "source-item:stream-0001",
        "x-knowledgeos-version-id":
          "version:stream-0001",
        "x-knowledgeos-title":
          "Streaming Publication",
        "x-knowledgeos-authors":
          "KnowledgeOS Team",
      },
      body: bytes,
    },
  );

  assert.equal(upload.status, 201);
  const uploadBody = await upload.json();
  assert.equal(uploadBody.byteLength, bytes.byteLength);

  const download = await fetch(
    `${baseUrl}/v1/master-library/publications/` +
      encodeURIComponent("publication:stream-0001") +
      "/versions/" +
      encodeURIComponent("version:stream-0001") +
      "/content",
  );

  assert.equal(download.status, 200);
  assert.equal(
    Buffer.from(await download.arrayBuffer()).toString("utf8"),
    "streaming master library content",
  );
  const etag = download.headers.get("etag");
  assert.ok(etag);

  const range = await fetch(
    `${baseUrl}/v1/master-library/publications/` +
      encodeURIComponent("publication:stream-0001") +
      "/versions/" +
      encodeURIComponent("version:stream-0001") +
      "/content",
    {
      headers: {
        range: "bytes=0-8",
      },
    },
  );

  assert.equal(range.status, 206);
  assert.equal(
    Buffer.from(await range.arrayBuffer()).toString("utf8"),
    "streaming",
  );
  assert.match(
    range.headers.get("content-range"),
    /^bytes 0-8\//,
  );

  const head = await fetch(
    `${baseUrl}/v1/master-library/publications/` +
      encodeURIComponent("publication:stream-0001") +
      "/versions/" +
      encodeURIComponent("version:stream-0001") +
      "/content",
    {
      method: "HEAD",
    },
  );
  assert.equal(head.status, 200);
  assert.equal(
    Number(head.headers.get("content-length")),
    bytes.byteLength,
  );

  const cached = await fetch(
    `${baseUrl}/v1/master-library/publications/` +
      encodeURIComponent("publication:stream-0001") +
      "/versions/" +
      encodeURIComponent("version:stream-0001") +
      "/content",
    {
      headers: {
        "if-none-match": etag,
      },
    },
  );
  assert.equal(cached.status, 304);

  console.log(JSON.stringify({
    flow:
      "stream-upload-download-range-head-etag",
    status: "passed",
    byteLength: bytes.byteLength,
  }));
} finally {
  await server.stop();
  await rm(root, { recursive: true, force: true });
}
