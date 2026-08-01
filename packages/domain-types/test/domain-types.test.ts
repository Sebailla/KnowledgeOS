import assert from "node:assert/strict";
import test from "node:test";
import {
  assertValidIdentity,
  isAuthoritative,
  isIsoTimestamp,
  validatePageLimit,
} from "../src/index.js";

test("validates stable identities", () => {
  assert.doesNotThrow(() => assertValidIdentity("publication:01JTEST123"));
  assert.throws(() => assertValidIdentity("x"));
});

test("classifies authority", () => {
  assert.equal(isAuthoritative("personal-knowledge"), true);
  assert.equal(isAuthoritative("derived"), false);
});

test("validates timestamps and pagination", () => {
  assert.equal(isIsoTimestamp("2026-08-01T00:00:00.000Z"), true);
  assert.doesNotThrow(() => validatePageLimit(50));
  assert.throws(() => validatePageLimit(0));
});
