import assert from "node:assert/strict";
import {
  libraryMigrations,
} from "../dist/index.js";

assert.equal(libraryMigrations.length, 1);
assert.equal(
  libraryMigrations[0].id,
  "0001_initial_library",
);
assert.match(
  libraryMigrations[0].sql,
  /create table if not exists knowledge_objects/,
);
assert.match(
  libraryMigrations[0].sql,
  /create table if not exists knowledgeos_outbox/,
);

console.log(JSON.stringify({
  flow: "postgres-server-composition-contract",
  status: "passed",
  migrations: libraryMigrations.length,
}));
