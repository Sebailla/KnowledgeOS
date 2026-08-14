import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("PostgreSQL harness fails clearly when Docker is unavailable", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/run-postgres-test.mjs"],
    {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, DOCKER_BIN: "knowledgeos-missing-docker" },
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Docker is required/);
});
