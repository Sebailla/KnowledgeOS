import assert from "node:assert/strict";
import {
  InMemorySearchCache,
  SearchRequestDeduplicator,
  serializeSearchCacheKey,
} from "../dist/index.js";

let now = 1_000;
const cache = new InMemorySearchCache(2, () => now);

const key = serializeSearchCacheKey({
  ownerId: "owner:1",
  query: "  heart attack ",
  mode: "hybrid",
  profile: "balanced",
  limit: 20,
  offset: 0,
});

cache.set(key, { total: 1 }, 100, ["document:1"]);
assert.equal(cache.get(key).total, 1);

now = 1_101;
assert.equal(cache.get(key), undefined);

let executions = 0;
const deduplicator = new SearchRequestDeduplicator();
const execute = () =>
  deduplicator.run("same", async () => {
    executions += 1;
    await Promise.resolve();
    return 42;
  });

const values = await Promise.all([execute(), execute(), execute()]);
assert.deepEqual(values, [42, 42, 42]);
assert.equal(executions, 1);

console.log(JSON.stringify({
  flow: "search-cache-ttl-tags-deduplication",
  status: "passed",
}));
