import assert from "node:assert/strict";
import { MasterDirectStreamingServer, FixtureDeliveryAuthorizer, createFixtureDeliveryBoundary } from "../dist/index.js";

const audit = [];
const calls = [];
const server = new MasterDirectStreamingServer({
  reader: { async describe() { throw new Error("not used"); }, async open() { throw new Error("not used"); } },
  catalog: { async browse() { return { protocolVersion: "v1", items: [] }; }, async manifest() { throw new Error("not used"); } },
  acquisitionReceipts: { async accept() { throw new Error("not used"); } },
  ingest: {
    async accept(request) {
      calls.push(request);
      return { operationId: "operation:ingest-http", publicationId: "publication:ingest-http", versionId: "version:ingest-http", knowledgeObjectId: "knowledge-object:ingest-http", outcome: "registered" };
    },
    async acceptStream(request) {
      const chunks = [];
      for await (const chunk of request.source) chunks.push(chunk);
      return this.accept({ ...request, bytes: Buffer.concat(chunks) });
    },
    async status(operationId) { return { operationId, state: "registered", outcome: "registered" }; },
  },
  delivery: createFixtureDeliveryBoundary({ authorizer: new FixtureDeliveryAuthorizer({ "fixture-acquisition-token": ["catalog.read", "publication.acquire", "catalog.write"] }), audit }),
}, { host: "127.0.0.1", port: 0 });

const address = await server.start();
const base = `http://${address.host}:${address.port}`;
const headers = { authorization: "Bearer fixture-acquisition-token", "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test" };
const multipart = (metadata, bytes, filename = "book.pdf") => {
  const boundary = "knowledgeos-boundary";
  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="${filename}"\r\nContent-Type: ${metadata.declaredMediaType}\r\n\r\n`),
      Buffer.from(bytes), Buffer.from(`\r\n--${boundary}--\r\n`),
    ]),
  };
};

try {
  const pdf = Buffer.from("%PDF-1.7");
  const metadata = { title: "HTTP Ingest", authors: ["Ada"], originalFilename: "book.pdf", declaredMediaType: "application/pdf", byteLength: pdf.byteLength };
  const form = multipart(metadata, pdf);
  const accepted = await fetch(`${base}/v1/master-library/publications:ingest`, { method: "POST", headers: { ...headers, "content-type": form.contentType, "idempotency-key": "ingest:http" }, body: form.body });
  assert.equal(accepted.status, 202);
  assert.equal((await accepted.json()).operationId, "operation:ingest-http");
  assert.equal(calls[0]?.metadata.title, "HTTP Ingest");
  assert.equal(calls[0]?.bytes.toString(), "%PDF-1.7");

  const status = await fetch(`${base}/v1/master-library/ingest-operations/operation%3Aingest-http`, { headers });
  assert.equal(status.status, 200);
  assert.deepEqual(await status.json(), { operationId: "operation:ingest-http", state: "registered", outcome: "registered" });

  const malformed = await fetch(`${base}/v1/master-library/publications:ingest`, { method: "POST", headers: { ...headers, "content-type": "multipart/form-data", "idempotency-key": "ingest:bad" }, body: "bad" });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).error.code, "ingest.validation-failed");

  const denied = await fetch(`${base}/v1/master-library/publications:ingest`, { method: "POST", headers: { "content-type": form.contentType, "idempotency-key": "ingest:denied", "x-forwarded-proto": "https", "x-forwarded-host": "master-library.test" }, body: form.body });
  assert.equal(denied.status, 403);
} finally {
  await server.stop();
}
