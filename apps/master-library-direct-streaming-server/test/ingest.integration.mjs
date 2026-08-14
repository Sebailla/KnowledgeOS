import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
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

const chunkedPost = (url, headers, body) => new Promise((resolve, reject) => {
  const target = new URL(url);
  const request = httpRequest({ host: target.hostname, port: target.port, method: "POST", path: target.pathname, headers }, (response) => {
    const chunks = [];
    response.on("data", (chunk) => chunks.push(chunk));
    response.once("end", () => resolve({ status: response.statusCode, body: Buffer.concat(chunks) }));
  });
  request.once("error", reject);
  request.write(body.subarray(0, 17));
  request.write(body.subarray(17));
  request.end();
});

const streamedRequest = (headers, chunks) => ({
  method: "POST",
  url: "/v1/master-library/publications:ingest",
  headers,
  socket: { remoteAddress: "127.0.0.1" },
  complete: true,
  once() {},
  async *[Symbol.asyncIterator]() { yield* chunks; },
});

const capturedResponse = () => {
  const state = { status: 0, body: Buffer.alloc(0) };
  return {
    state,
    response: {
      set statusCode(value) { state.status = value; },
      setHeader() {},
      write() { return true; },
      once() {},
      end(value) { state.body = Buffer.from(value ?? ""); },
    },
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

  const chunked = await chunkedPost(`${base}/v1/master-library/publications:ingest`, { ...headers, "content-type": form.contentType, "idempotency-key": "ingest:chunked" }, form.body);
  assert.equal(chunked.status, 202, chunked.body.toString());

  // A chunked forwarder may deliver the complete control part with source bytes
  // in one chunk. The control-size bound applies to control data, not the chunk.
  const largePdf = Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(70 * 1024)]);
  const largeForm = multipart({ ...metadata, byteLength: largePdf.byteLength }, largePdf, "large.pdf");
  const capture = capturedResponse();
  await server.handle(streamedRequest({ ...headers, "content-type": largeForm.contentType, "transfer-encoding": "chunked", "idempotency-key": "ingest:chunked-large" }, [largeForm.body]), capture.response);
  assert.equal(capture.state.status, 202, capture.state.body.toString());

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
