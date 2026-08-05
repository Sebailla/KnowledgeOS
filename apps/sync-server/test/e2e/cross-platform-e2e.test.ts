import assert from "node:assert/strict";
import test from "node:test";
import { SyncHTTPServer } from "../../src/server.js";

interface SyncOperation {
  readonly operationId: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly operationType: string;
  readonly payload: unknown;
  readonly deviceId: string;
  readonly sequence: number;
}

async function jsonRequest(url: string, init: { readonly method?: string; readonly headers?: Readonly<Record<string,string>>; readonly body?: string }): Promise<any> {
  const response = await fetch(url, init);
  assert.equal(response.ok, true);
  return response.json();
}

function operation(id: string, device: string, sequence: number, payload: unknown): SyncOperation {
  return {
    operationId: id,
    entityType: "annotation",
    entityId: "document:knowledgeos",
    operationType: "update",
    payload,
    deviceId: device,
    sequence,
  };
}

test("cross-platform clients converge without duplicate operations", async () => {
  const server = new SyncHTTPServer({ host: "127.0.0.1", port: 0, token: "e2e-token" });
  const address = await server.start();
  const base = `http://127.0.0.1:${address.port}`;
  const headers = { "content-type": "application/json", authorization: "Bearer e2e-token" };

  try {
    const macOperation = operation("op:mac:1", "mac", 1, { anchor: "section:1", text: "Imported on macOS" });
    const push1 = await jsonRequest(`${base}/v1/sync/push`, {
      method: "POST",
      headers: { ...headers, "idempotency-key": "push:mac:1" },
      body: JSON.stringify({ operations: [macOperation] }),
    });
    assert.equal(push1.accepted, 1);

    const duplicate = await jsonRequest(`${base}/v1/sync/push`, {
      method: "POST",
      headers: { ...headers, "idempotency-key": "push:mac:1" },
      body: JSON.stringify({ operations: [macOperation] }),
    });
    assert.equal(JSON.stringify(duplicate), JSON.stringify(push1));

    const iphonePull = await jsonRequest(`${base}/v1/sync/pull`, {
      method: "POST", headers, body: JSON.stringify({ cursor: "0", limit: 50 }),
    });
    assert.equal(iphonePull.operations.length, 1);

    const iphoneOperation = operation("op:iphone:1", "iphone", 1, { anchor: "section:1", bookmark: true });
    await jsonRequest(`${base}/v1/sync/push`, {
      method: "POST",
      headers: { ...headers, "idempotency-key": "push:iphone:1" },
      body: JSON.stringify({ operations: [iphoneOperation] }),
    });

    const ipadPull = await jsonRequest(`${base}/v1/sync/pull`, {
      method: "POST", headers, body: JSON.stringify({ cursor: "0", limit: 50 }),
    });
    assert.equal(ipadPull.operations.length, 2);
    assert.equal(new Set(ipadPull.operations.map((item: SyncOperation) => item.operationId)).size, 2);

    const macPull = await jsonRequest(`${base}/v1/sync/pull`, {
      method: "POST", headers, body: JSON.stringify({ cursor: "1", limit: 50 }),
    });
    assert.equal(macPull.operations.length, 1);
    assert.equal(macPull.cursor, "2");
  } finally {
    await server.stop();
  }
});
