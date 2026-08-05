import assert from "node:assert/strict";
import test from "node:test";
import { UniversalSyncProtocol } from "@knowledgeos/sync";
import { SyncHTTPServer } from "../src/index.js";

const protocol = new UniversalSyncProtocol();

test("USP envelope endpoint acknowledges operations", async () => {
  const server = new SyncHTTPServer({ host: "127.0.0.1", port: 0 });
  const address = await server.start();
  const operation = protocol.createOperation({
    operationId: "usp:1", entityType: "bookmark", operationType: "create",
    entityId: "bookmark:1", deviceId: "device:1", userId: "user:1",
    sequence: 1, timestamp: "2026-08-04T00:00:00.000Z", payload: {},
  });
  const batch = protocol.createBatch({
    batchId: "batch:usp", operations: [operation],
    cursor: { serverSequence: 0, localSequence: 1 },
    createdAt: "2026-08-04T00:00:00.000Z",
  });
  const envelope = protocol.createEnvelope({
    requestId: "request:usp", sessionId: "session:usp", deviceId: "device:1",
    clientVersion: "1.0.0", batch,
  });
  const response = await fetch(`http://${address.host}:${address.port}/v1/usp/envelopes`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(envelope),
  });
  const result = await response.json() as { acceptedOperationIds: string[] };
  assert.equal(result.acceptedOperationIds.length, 1);
  await server.stop();
});
