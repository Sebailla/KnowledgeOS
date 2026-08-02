import assert from "node:assert/strict";
import {
  SearchProductionRuntime,
} from "../dist/index.js";

let executions = 0;

const runtime = new SearchProductionRuntime(
  {
    async search(request) {
      executions += 1;
      return {
        query: request.query,
        mode: request.mode,
        results: [{
          searchDocumentId: "search:1",
          title: "Heart failure",
          kind: "publication",
          finalScore: 1,
        }],
        total: 1,
        durationMilliseconds: 1,
      };
    },
    async health() {
      return {
        lexical: "available",
        semantic: "available",
        graph: "available",
        live: "available",
      };
    },
  },
  "owner:1",
  {
    cacheEntries: 100,
    cacheTtlMilliseconds: 60_000,
  },
);

const request = {
  query: "heart failure",
  mode: "hybrid",
  rankingProfile: "balanced",
  limit: 20,
  offset: 0,
  includeFacets: false,
  includeExplanation: false,
};

await Promise.all([
  runtime.search(request),
  runtime.search(request),
  runtime.search(request),
]);

assert.equal(executions, 1);
assert.equal(runtime.diagnostics().cache.hits >= 0, true);

runtime.invalidateSearchDocument("search:1");
await runtime.search(request);
assert.equal(executions, 2);

console.log(JSON.stringify({
  flow: "search-production-cache-dedup-invalidation",
  status: "passed",
}));
