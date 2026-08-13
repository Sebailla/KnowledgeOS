import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  InMemoryMasterStorageCatalog,
  InMemoryAcquisitionReceiptRepository,
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import {
  DirectMasterStorageReader,
} from "@knowledgeos/master-storage-node-stream";
import {
  FixtureDeliveryAuthorizer,
  MasterDirectStreamingServer,
  createFixtureDeliveryBoundary,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-direct-server-"),
);

try {
  let recoveryRuns = 0;
  let readinessComplete = false;
  const audit = [];
  const receiptCalls = [];
  const acquisitionReceipts = new InMemoryAcquisitionReceiptRepository();
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
      catalog: {
        async browse(cursor) {
          assert.equal(cursor, undefined);
          return {
            protocolVersion: "v1",
            items: [{
              publicationId: stored.publicationId,
              knowledgeObjectId: "knowledge-object:direct-server-0001",
              title: "Direct server fixture",
              authors: ["KnowledgeOS"],
              versionId: stored.versionId,
              availability: { state: "available" },
            }],
          };
        },
        async manifest(publicationId, versionId) {
          assert.equal(publicationId, stored.publicationId);
          assert.equal(versionId, stored.versionId);
          return {
            protocolVersion: "v1",
            publicationId: stored.publicationId,
            knowledgeObjectId: "knowledge-object:direct-server-0001",
            versionId: stored.versionId,
            contentFingerprint: stored.contentFingerprint,
            byteLength: stored.byteLength,
            mediaType: stored.mediaType,
          };
        },
      },
      processingRecovery: {
        async recover() {
          recoveryRuns += 1;
        },
      },
      readiness: {
        async ready() { return readinessComplete; },
      },
      acquisitionReceipts: {
        async accept(request, manifest) {
          receiptCalls.push(request);
          return acquisitionReceipts.accept(request, manifest);
        },
      },
      delivery: createFixtureDeliveryBoundary({
        authorizer: new FixtureDeliveryAuthorizer({
          "fixture-acquisition-token": [
            "catalog.read",
            "publication.acquire",
          ],
        }),
        audit,
      }),
    },
    {
      host: "127.0.0.1",
      port: 0,
    },
  );

  const address = await server.start();
  assert.equal(recoveryRuns, 1);
  const url =
    `http://${address.host}:${address.port}` +
    "/v1/master-library/publications/" +
    encodeURIComponent(stored.publicationId) +
    "/versions/" +
    encodeURIComponent(stored.versionId) +
    "/content";
  const catalogUrl =
    `http://${address.host}:${address.port}` +
    "/v1/master-library/catalog";
  const manifestUrl =
    `http://${address.host}:${address.port}` +
    "/v1/master-library/publications/" +
    encodeURIComponent(stored.publicationId) +
    "/versions/" +
    encodeURIComponent(stored.versionId) +
    "/manifest";
  const aliasUrl =
    `http://${address.host}:${address.port}` +
    "/master-library/publications/" +
    encodeURIComponent(stored.publicationId) +
    "/versions/" +
    encodeURIComponent(stored.versionId) +
    "/content";
  const acquisitionUrl =
    `http://${address.host}:${address.port}` +
    "/v1/master-library/acquisitions";

  try {
    const readinessUrl = `http://${address.host}:${address.port}/health/ready`;
    assert.equal((await fetch(readinessUrl)).status, 503);
    readinessComplete = true;
    assert.deepEqual(await (await fetch(readinessUrl)).json(), { state: "ready" });
    const deliveryHeaders = {
      authorization: "Bearer fixture-acquisition-token",
      "x-forwarded-proto": "https",
      "x-forwarded-host": "master-library.test",
    };
    readinessComplete = false;
    assert.equal((await fetch(catalogUrl, { headers: deliveryHeaders })).status, 503);
    readinessComplete = true;
    const catalogResponse = await fetch(catalogUrl, { headers: deliveryHeaders });
    assert.equal(catalogResponse.status, 200);
    assert.deepEqual(await catalogResponse.json(), {
      protocolVersion: "v1",
      items: [{
        publicationId: stored.publicationId,
        knowledgeObjectId: "knowledge-object:direct-server-0001",
        title: "Direct server fixture",
        authors: ["KnowledgeOS"],
        versionId: stored.versionId,
        availability: { state: "available" },
      }],
    });

    const manifestResponse = await fetch(manifestUrl, { headers: deliveryHeaders });
    assert.equal(manifestResponse.status, 200);
    assert.equal(
      (await manifestResponse.json()).contentFingerprint,
      stored.contentFingerprint,
    );

    const acceptedAcquisition = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        ...deliveryHeaders,
        "content-type": "application/json",
        "idempotency-key": "idempotency:direct-server-0001",
      },
      body: JSON.stringify({
        publicationId: stored.publicationId,
        versionId: stored.versionId,
        targetLocalLibraryId: "local-library:direct-server-0001",
      }),
    });
    assert.equal(acceptedAcquisition.status, 202);
    const acceptedPayload = await acceptedAcquisition.json();
    assert.equal(acceptedPayload.receipt.accepted, true);
    assert.equal(acceptedPayload.manifest.contentFingerprint, stored.contentFingerprint);
    assert.equal(JSON.stringify(acceptedPayload).includes("personal"), false);

    const replay = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        ...deliveryHeaders,
        "content-type": "application/json",
        "idempotency-key": "idempotency:direct-server-0001",
      },
      body: JSON.stringify({
        publicationId: stored.publicationId,
        versionId: stored.versionId,
        targetLocalLibraryId: "local-library:direct-server-0001",
      }),
    });
    assert.equal(replay.status, 202);
    assert.deepEqual(await replay.json(), acceptedPayload);

    const conflict = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        ...deliveryHeaders,
        "content-type": "application/json",
        "idempotency-key": "idempotency:direct-server-0001",
      },
      body: JSON.stringify({
        publicationId: stored.publicationId,
        versionId: stored.versionId,
        targetLocalLibraryId: "local-library:other-0001",
      }),
    });
    assert.equal(conflict.status, 409);
    assert.equal((await conflict.json()).error.code, "operation.conflict");

    const malformed = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        ...deliveryHeaders,
        "content-type": "application/json",
        "idempotency-key": "idempotency:malformed-0001",
      },
      body: JSON.stringify({ publicationId: "not-a-stable-id" }),
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, "validation.failed");
    assert.equal(receiptCalls.length, 3);

    const invalidJson = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        ...deliveryHeaders,
        "content-type": "application/json",
        "idempotency-key": "idempotency:invalid-json-0001",
      },
      body: "{",
    });
    assert.equal(invalidJson.status, 400);
    assert.equal((await invalidJson.json()).error.code, "validation.failed");
    assert.equal(receiptCalls.length, 3);

    const unavailable = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        ...deliveryHeaders,
        "content-type": "application/json",
        "idempotency-key": "idempotency:unavailable-0001",
      },
      body: JSON.stringify({
        publicationId: "publication:missing-0001",
        versionId: "version:missing-0001",
        targetLocalLibraryId: "local-library:direct-server-0001",
      }),
    });
    assert.equal(unavailable.status, 404);
    assert.equal((await unavailable.json()).error.code, "catalog.not-found");
    assert.equal(receiptCalls.length, 3);

    const unauthorizedAcquisition = await fetch(acquisitionUrl, {
      method: "POST",
      headers: {
        authorization: "Bearer fixture-catalog-token",
        "x-forwarded-proto": "https",
        "x-forwarded-host": "master-library.test",
        "content-type": "application/json",
        "idempotency-key": "idempotency:unauthorized-0001",
      },
      body: JSON.stringify({
        publicationId: stored.publicationId,
        versionId: stored.versionId,
        targetLocalLibraryId: "local-library:direct-server-0001",
      }),
    });
    assert.equal(unauthorizedAcquisition.status, 403);
    assert.equal((await unauthorizedAcquisition.json()).error.code, "authorization.denied");

    const alias = await fetch(aliasUrl, { redirect: "manual", headers: deliveryHeaders });
    assert.equal(alias.status, 308);
    assert.equal(alias.headers.get("location"), new URL(url).pathname);

    const personalKnowledge = await fetch(
      `http://${address.host}:${address.port}/v1/master-library/personal-knowledge/annotation:forbidden-0001`,
      { headers: deliveryHeaders },
    );
    assert.equal(personalKnowledge.status, 403);
    assert.deepEqual(await personalKnowledge.json(), {
      error: {
        code: "master-library.personal-knowledge-forbidden",
        correlationId: "correlation:master-library-request",
      },
    });

    const missingManifest = await fetch(
      `http://${address.host}:${address.port}/v1/master-library/publications/publication%3Amissing-0001/versions/version%3Amissing-0001/manifest`,
      { headers: deliveryHeaders },
    );
    assert.equal(missingManifest.status, 404);
    assert.equal(
      (await missingManifest.json()).error.code,
      "catalog.not-found",
    );

    const full = await fetch(url, { headers: deliveryHeaders });
    assert.equal(full.status, 200);
    assert.equal(
      Buffer.from(
        await full.arrayBuffer(),
      ).toString("utf8"),
      "direct filesystem streaming response",
    );

    const range = await fetch(url, {
      headers: {
        ...deliveryHeaders,
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
      method: "HEAD", headers: deliveryHeaders,
    });
    assert.equal(head.status, 200);
    assert.equal(
      Number(head.headers.get("content-length")),
      bytes.byteLength,
    );

    const etag = full.headers.get("etag");
    const cached = await fetch(url, {
      headers: {
        ...deliveryHeaders,
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
