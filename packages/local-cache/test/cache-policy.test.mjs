import assert from "node:assert/strict";
import {
  LocalCachePlanner,
} from "../dist/index.js";

const records = [
  {
    publicationId: "publication:old",
    byteLength: 100,
    readableOffline: true,
    pinned: false,
    lastAccessedAt:
      "2026-01-01T00:00:00.000Z",
  },
  {
    publicationId: "publication:new",
    byteLength: 100,
    readableOffline: true,
    pinned: false,
    lastAccessedAt:
      "2026-08-01T00:00:00.000Z",
  },
  {
    publicationId: "publication:pinned",
    byteLength: 100,
    readableOffline: true,
    pinned: true,
  },
];

const result =
  new LocalCachePlanner().plan(
    records,
    {
      maximumOfflineBytes: 200,
      minimumFreeBytes: 100,
      preserveRecentlyAccessedCount: 1,
    },
    100,
  );

assert.deepEqual(
  result.evict.map(
    (record) =>
      record.publicationId,
  ),
  ["publication:old"],
);

assert.equal(
  result.keep.some(
    (record) =>
      record.publicationId ===
      "publication:pinned",
  ),
  true,
);

console.log(JSON.stringify({
  flow:
    "local-cache-lru-pin-free-space",
  status: "passed",
  evictions:
    result.evict.length,
}));
