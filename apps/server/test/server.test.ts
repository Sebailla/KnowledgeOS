import assert from "node:assert/strict";
import test from "node:test";
import { createServerApplication } from "../src/index.js";

test("live health endpoint responds", async () => {
  const app = createServerApplication();
  const response = await app.router.handle({
    method: "GET",
    path: "/health/live",
    headers: {},
  });

  assert.equal(response.status, 200);
});

test("unknown route returns 404", async () => {
  const app = createServerApplication();
  const response = await app.router.handle({
    method: "GET",
    path: "/missing",
    headers: {},
  });

  assert.equal(response.status, 404);
});

test("master catalog endpoint responds", async () => {
  const app = createServerApplication();
  const response = await app.router.handle({
    method: "GET",
    path: "/v1/library/master-catalog",
    headers: {},
    query: { limit: "10" },
  });

  assert.equal(response.status, 200);
});
