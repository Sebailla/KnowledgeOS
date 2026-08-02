import assert from "node:assert/strict";
import {
  SearchCircuitBreaker,
  SearchLatencyMetrics,
  validateSearchPerformanceBudget,
} from "../dist/index.js";

validateSearchPerformanceBudget({
  lexicalMilliseconds: 50,
  semanticMilliseconds: 800,
  graphMilliseconds: 250,
  totalMilliseconds: 1_200,
});

let now = 0;
const breaker = new SearchCircuitBreaker(
  {
    failureThreshold: 2,
    recoveryTimeoutMilliseconds: 100,
  },
  () => now,
);

for (let i = 0; i < 2; i += 1) {
  await assert.rejects(
    breaker.execute(async () => {
      throw new Error("failure");
    }),
  );
}

assert.equal(breaker.currentState(), "open");
now = 101;
assert.equal(breaker.currentState(), "half-open");
assert.equal(
  await breaker.execute(async () => "ok"),
  "ok",
);
assert.equal(breaker.currentState(), "closed");

const metrics = new SearchLatencyMetrics();
for (const value of [10, 20, 30, 40, 50]) {
  metrics.record({
    stage: "lexical",
    durationMilliseconds: value,
    success: true,
  });
}

assert.equal(metrics.summary("lexical").p95, 50);

console.log(JSON.stringify({
  flow: "search-circuit-budget-latency",
  status: "passed",
}));
