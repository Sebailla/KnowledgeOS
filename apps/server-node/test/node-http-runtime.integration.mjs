import assert from "node:assert/strict";
import { startKnowledgeOSServer } from "../dist/index.js";

const server = await startKnowledgeOSServer({
  host: "127.0.0.1",
  port: 0,
  environment: "test",
  databaseUrl: "postgres://unused-in-memory-composition",
  requestBodyLimitBytes: 1024 * 1024,
});

const baseUrl =
  `http://${server.address.host}:${server.address.port}`;

try {
  const live = await fetch(`${baseUrl}/health/live`);
  assert.equal(live.status, 200);
  assert.deepEqual(await live.json(), { state: "healthy" });

  const register = await fetch(
    `${baseUrl}/v1/library/local-sources`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "node-http-runtime-0001",
      },
      body: JSON.stringify({
        localLibraryId: server.defaultLocalLibraryId,
        sourceItemId: "source-item:node-runtime-0001",
        contentFingerprint: "sha256:node-runtime-0001",
        title: "Node Runtime Publication",
        originalFilename: "runtime.pdf",
        mediaType: "application/pdf",
        byteLength: 2048,
      }),
    },
  );
  assert.equal(register.status, 202);

  const listing = await fetch(
    `${baseUrl}/v1/library/local-library?` +
      new URLSearchParams({
        localLibraryId: server.defaultLocalLibraryId,
        limit: "10",
      }),
  );
  assert.equal(listing.status, 200);

  const page = await listing.json();
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].title, "Node Runtime Publication");
  assert.equal(page.items[0].availability.readableOffline, true);

  const availability = await fetch(
    `${baseUrl}/v1/library/local-availability?` +
      new URLSearchParams({
        localLibraryId: server.defaultLocalLibraryId,
        knowledgeObjectId: page.items[0].knowledgeObjectId,
      }),
  );
  assert.equal(availability.status, 200);

  const availabilityBody = await availability.json();
  assert.equal(
    availabilityBody.availability.state,
    "local-available",
  );
  assert.equal(
    availabilityBody.availability.readableOffline,
    true,
  );

  const invalidJson = await fetch(
    `${baseUrl}/v1/library/local-sources`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{invalid",
    },
  );
  assert.equal(invalidJson.status, 400);

  console.log(JSON.stringify({
    flow: "node-http-register-to-offline-availability",
    status: "passed",
    port: server.address.port,
    knowledgeObjectId: page.items[0].knowledgeObjectId,
  }));
} finally {
  await server.stop();
}
