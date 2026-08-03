import assert from "node:assert/strict";
import {
  LocalMaintenanceRunner,
} from "../dist/index.js";
import {
  LocalCachePlanner,
} from "@knowledgeos/local-cache";

const evicted = [];
let checkpointed = false;

const runner =
  new LocalMaintenanceRunner(
    {
      async list() {
        return [
          {
            publicationId:
              "publication:old",
            byteLength:
              100,
            readableOffline:
              true,
            pinned:
              false,
            lastAccessedAt:
              "2026-01-01T00:00:00.000Z",
          },
          {
            publicationId:
              "publication:pinned",
            byteLength:
              100,
            readableOffline:
              true,
            pinned:
              true,
          },
        ];
      },
    },
    {
      async inspect() {
        return [];
      },
    },
    {
      async markInvalidRecords() {
        return {
          issues: [],
          repaired: [],
        };
      },
    },
    new LocalCachePlanner(),
    {
      async evict(
        _localLibraryId,
        publicationId,
      ) {
        evicted.push(publicationId);
        return {};
      },
    },
    {
      checkpoint() {
        checkpointed = true;
      },
    },
    {
      async availableBytes() {
        return 50;
      },
    },
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

const result = await runner.run(
  "local-library:maintenance",
  {
    maximumOfflineBytes: 100,
    minimumFreeBytes: 100,
    preserveRecentlyAccessedCount: 0,
  },
);

assert.equal(result.length, 4);
assert.deepEqual(
  evicted,
  ["publication:old"],
);
assert.equal(checkpointed, true);

console.log(JSON.stringify({
  flow:
    "local-maintenance-integrity-repair-cache-checkpoint",
  status: "passed",
}));
