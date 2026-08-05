import assert from "node:assert/strict";
import test from "node:test";
import {
  InMemoryOperationStore,
  UniversalSyncProtocol,
  canonicalStringify,
} from "../src/index.js";

const protocol = new UniversalSyncProtocol();

function envelope() {
  const operation = protocol.createOperation({
    operationId: "operation:1",
    entityType: "annotation",
    operationType: "upsert",
    entityId: "annotation:1",
    deviceId: "device:1",
    userId: "user:1",
    sequence: 1,
    timestamp: "2026-08-04T00:00:00.000Z",
    payload: { text: "note", color: "yellow" },
  });
  const batch = protocol.createBatch({
    batchId: "batch:1",
    operations: [operation],
    cursor: { serverSequence: 0, localSequence: 1 },
    createdAt: "2026-08-04T00:00:00.000Z",
  });
  return protocol.createEnvelope({
    requestId: "request:1",
    sessionId: "session:1",
    deviceId: "device:1",
    clientVersion: "1.0.0",
    batch,
  });
}

test("canonical serialization is deterministic", () => {
  assert.equal(canonicalStringify({ b: 2, a: 1 }), canonicalStringify({ a: 1, b: 2 }));
});

test("protocol validates envelope", () => {
  protocol.validateEnvelope(envelope());
  assert.equal(true, true);
});

test("store deduplicates operation ids", () => {
  const store = new InMemoryOperationStore();
  const first = store.accept(envelope());
  const second = store.accept(envelope());
  assert.equal(first.acceptedOperationIds.length, 1);
  assert.equal(second.duplicateOperationIds.length, 1);
});

test("unsupported version is rejected", () => {
  const value = envelope();
  assert.throws(() => protocol.validateEnvelope({ ...value, protocolVersion: "2.0" }));
});
