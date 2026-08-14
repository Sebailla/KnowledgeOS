import assert from "node:assert/strict";
import { DEFAULT_INSPECTION_MAX_BYTES, MasterDirectStreamingServer, FixtureDeliveryAuthorizer, createFixtureDeliveryBoundary } from "../dist/index.js";

assert.equal(DEFAULT_INSPECTION_MAX_BYTES, 16 * 1024 * 1024);

const calls = [];
const server = new MasterDirectStreamingServer({
  reader: { async describe() { throw new Error("not used"); }, async open() { throw new Error("not used"); } },
  catalog: { async browse() { return { protocolVersion: "v1", items: [] }; }, async manifest() { throw new Error("not used"); } },
  acquisitionReceipts: { async accept() { throw new Error("not used"); } },
  inspection: {
    async inspect(request) {
      const source = [];
      for await (const chunk of request.source) source.push(chunk);
      calls.push({ ...request, source });
      return { title: { value: "Inspected title", evidence: "pdf-info", confidence: "high" }, authors: [{ value: "Ada Lovelace", evidence: "pdf-info", confidence: "high" }], candidates: [], correlationId: request.correlationId, outcome: "completed" };
    },
  },
  inspectionMaximumBytes: 2 * 1024 * 1024,
  delivery: createFixtureDeliveryBoundary({ authorizer: new FixtureDeliveryAuthorizer({ "fixture-acquisition-token": ["catalog.write"] }), audit: [] }),
}, { host: "127.0.0.1", port: 0 });

const multipart = (metadata, bytes) => {
  const boundary = "knowledgeos-inspection-boundary";
  return { contentType: `multipart/form-data; boundary=${boundary}`, body: new Blob([`--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="book.pdf"\r\nContent-Type: application/pdf\r\n\r\n`, bytes, `\r\n--${boundary}--\r\n`]) };
};

try {
  const address = await server.start();
  const base = `http://${address.host}:${address.port}`;
  const metadata = { originalFilename: "book.pdf", declaredMediaType: "application/pdf", byteLength: 8 };
  const form = multipart(metadata, "%PDF-1.7");
  const accepted = await fetch(`${base}/v1/master-library/publications:inspect`, { method: "POST", headers: { authorization: "Bearer fixture-acquisition-token", "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test", "content-type": form.contentType }, body: form.body });
  assert.equal(accepted.status, 200);
  assert.equal((await accepted.json()).title.value, "Inspected title");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].metadata.title, undefined);

  const denied = await fetch(`${base}/v1/master-library/publications:inspect`, { method: "POST", headers: { "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test", "content-type": form.contentType }, body: form.body });
  assert.equal(denied.status, 403);

  // This is larger than the former fixed 1 MiB bound but below the configured
  // 2 MiB inspection cap, proving the route accepts an explicit safe limit.
  const largerThanLegacyLimit = multipart({ ...metadata, byteLength: 1_048_577 }, new Uint8Array(1_048_577));
  const largerAccepted = await fetch(`${base}/v1/master-library/publications:inspect`, { method: "POST", headers: { authorization: "Bearer fixture-acquisition-token", "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test", "content-type": largerThanLegacyLimit.contentType }, body: largerThanLegacyLimit.body });
  assert.equal(largerAccepted.status, 200);

  const oversized = multipart({ ...metadata, byteLength: (2 * 1024 * 1024) + 1 }, new Uint8Array((2 * 1024 * 1024) + 1));
  const capacity = await fetch(`${base}/v1/master-library/publications:inspect`, { method: "POST", headers: { authorization: "Bearer fixture-acquisition-token", "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test", "content-type": oversized.contentType }, body: oversized.body });
  assert.equal(capacity.status, 413);
  assert.equal((await capacity.json()).error.code, "inspection.capacity-exceeded");

  const cancelled = { state: { status: 0, body: "" }, response: { set statusCode(value) { this.state.status = value; }, setHeader() {}, end(value) { this.state.body = String(value ?? ""); }, state: undefined } };
  cancelled.response.state = cancelled.state;
  const cancelledRequest = {
    method: "POST", url: "/v1/master-library/publications:inspect", aborted: true,
    headers: { authorization: "Bearer fixture-acquisition-token", "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test", "content-type": form.contentType },
    socket: { remoteAddress: "127.0.0.1" }, complete: true, once() {},
    async *[Symbol.asyncIterator]() { yield new Uint8Array(await form.body.arrayBuffer()); },
  };
  await server.handle(cancelledRequest, cancelled.response);
  assert.equal(cancelled.state.status, 499);
  assert.equal(JSON.parse(cancelled.state.body).error.code, "inspection.cancelled");
} finally {
  await server.stop();
}
