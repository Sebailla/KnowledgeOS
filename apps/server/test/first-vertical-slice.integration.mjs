import assert from "node:assert/strict";
import { createServerApplication } from "../dist/index.js";

const app = createServerApplication();
const libraryId = app.defaultLocalLibraryId;
const sourceItemId = "source-item:integration-0001";

const register = await app.router.handle({
  method: "POST",
  path: "/v1/library/local-sources",
  headers: {
    "idempotency-key": "integration-register-0001",
  },
  body: {
    localLibraryId: libraryId,
    sourceItemId,
    contentFingerprint: "sha256:integration-0001",
    originalFilename: "KnowledgeOS Introduction.pdf",
    title: "KnowledgeOS Introduction",
    mediaType: "application/pdf",
    byteLength: 4096,
  },
});

assert.equal(register.status, 202);
assert.equal(register.body.accepted, true);

const listing = await app.router.handle({
  method: "GET",
  path: "/v1/library/local-library",
  headers: {},
  query: {
    localLibraryId: libraryId,
    limit: "10",
  },
});

assert.equal(listing.status, 200);
assert.equal(listing.body.items.length, 1);
assert.equal(
  listing.body.items[0].title,
  "KnowledgeOS Introduction",
);
assert.equal(
  listing.body.items[0].availability.readableOffline,
  true,
);

const knowledgeObjectId =
  listing.body.items[0].knowledgeObjectId;

const availability = await app.router.handle({
  method: "GET",
  path: "/v1/library/local-availability",
  headers: {},
  query: {
    localLibraryId: libraryId,
    knowledgeObjectId,
  },
});

assert.equal(availability.status, 200);
assert.equal(
  availability.body.availability.state,
  "local-available",
);
assert.equal(
  availability.body.availability.readableOffline,
  true,
);
assert.equal(availability.body.sourceItemId, sourceItemId);

console.log(
  JSON.stringify({
    flow: "register-local-source-to-offline-availability",
    status: "passed",
    libraryId,
    knowledgeObjectId,
    sourceItemId,
  }),
);
