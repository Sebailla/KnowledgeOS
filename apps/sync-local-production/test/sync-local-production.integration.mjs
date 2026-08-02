import assert from "node:assert/strict";
import {
  createHash,
} from "node:crypto";
import {
  createServer,
} from "node:http";
import {
  mkdtemp,
  readFile,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  startSyncLocalProduction,
} from "../dist/index.js";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  SqliteLocalPublicationRepository,
} from "@knowledgeos/local-library-sqlite";

const bytes = Buffer.from(
  "production-master-to-local-sync",
);
const fingerprint =
  "sha256:" +
  createHash("sha256")
    .update(bytes)
    .digest("hex");

const server = createServer(
  (request, response) => {
    response.setHeader(
      "content-type",
      "application/pdf",
    );
    response.setHeader(
      "etag",
      `"${fingerprint}"`,
    );
    response.setHeader(
      "accept-ranges",
      "bytes",
    );

    if (
      request.method === "HEAD"
    ) {
      response.statusCode = 200;
      response.setHeader(
        "content-length",
        bytes.byteLength,
      );
      response.end();
      return;
    }

    const range =
      request.headers.range;
    const match =
      /^bytes=(\d+)-(\d+)$/.exec(
        String(range),
      );
    const start =
      Number(match[1]);
    const end =
      Number(match[2]);
    const body =
      bytes.subarray(
        start,
        end + 1,
      );

    response.statusCode = 206;
    response.setHeader(
      "content-range",
      `bytes ${start}-${end}/${bytes.byteLength}`,
    );
    response.setHeader(
      "content-length",
      body.byteLength,
    );
    response.end(body);
  },
);

await new Promise(
  (resolve) =>
    server.listen(
      0,
      "127.0.0.1",
      resolve,
    ),
);

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-sync-production-"),
);
const address =
  server.address();
const databasePath =
  join(root, "local-library.sqlite");

try {
  const running =
    await startSyncLocalProduction({
      root,
      localLibraryId:
        "local-library:production-sync",
      masterBaseUrl:
        `http://127.0.0.1:${address.port}`,
      databasePath,
      localStoragePath:
        join(root, "storage"),
      stagingPath:
        join(root, "staging"),
      chunkBytes:
        6,
      maximumConcurrency:
        2,
    });

  await running.registerTransfer({
    transferId:
      "transfer:production-sync-1",
    planId:
      "plan:production-sync-1",
    localLibraryId:
      "local-library:production-sync",
    publicationId:
      "publication:production-sync-1",
    knowledgeObjectId:
      "knowledge-object:production-sync-1",
    versionId:
      "version:production-sync-1",
    sourceItemId:
      "source-item:production-sync-1",
    title:
      "Production Master to Local",
    mediaType:
      "application/pdf",
    byteLength:
      bytes.byteLength,
    contentFingerprint:
      fingerprint,
  });

  running.enqueue({
    jobId:
      "job:production-sync-1",
    planId:
      "plan:production-sync-1",
    transferId:
      "transfer:production-sync-1",
    priority:
      10,
  });

  await running.drain();

  const state =
    await running.getState(
      "transfer:production-sync-1",
    );

  assert.equal(
    state.completed,
    true,
  );
  assert.equal(
    state.checksumVerified,
    true,
  );

  running.close();

  const reopened =
    new NodeSqliteDatabase({
      path: databasePath,
    });

  const publications =
    new SqliteLocalPublicationRepository(
      reopened,
    );

  const local =
    await publications.get(
      "local-library:production-sync",
      "publication:production-sync-1",
    );

  assert.equal(
    local.readableOffline,
    true,
  );
  assert.equal(
    local.acquisitionStatus,
    "available",
  );

  const localBytes =
    await readFile(
      join(
        root,
        "storage",
        local.relativePath,
      ),
    );

  assert.equal(
    localBytes.toString("utf8"),
    "production-master-to-local-sync",
  );

  reopened.close();

  console.log(JSON.stringify({
    flow:
      "production-http-range-sqlite-staging-local-commit",
    status:
      "passed",
  }));
} finally {
  await new Promise(
    (resolve, reject) =>
      server.close(
        (error) =>
          error
            ? reject(error)
            : resolve(),
      ),
  );

  await rm(root, {
    recursive: true,
    force: true,
  });
}
