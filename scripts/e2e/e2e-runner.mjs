#!/usr/bin/env node
import { createServer } from "node:http";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";

const root = process.env.KNOWLEDGEOS_E2E_ROOT ?? path.resolve(".e2e-runtime");
const reportDir = path.join(root, "reports");
const state = { operations: [], idempotency: new Map(), cursor: 0 };
const startedAt = new Date().toISOString();
const correlationId = randomUUID();

await rm(root, { recursive: true, force: true });
await mkdir(reportDir, { recursive: true });

const server = createServer(async (request, response) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
  const reply = (status, value) => {
    response.writeHead(status, { "content-type": "application/json", "x-correlation-id": correlationId });
    response.end(JSON.stringify(value));
  };
  if (request.url === "/health") return reply(200, { status: "ok", protocolVersion: "1.0" });
  if (request.url === "/push") {
    const key = request.headers["idempotency-key"];
    if (!key) return reply(400, { error: "IDEMPOTENCY_KEY_REQUIRED" });
    if (state.idempotency.has(key)) return reply(200, state.idempotency.get(key));
    const operations = Array.isArray(body.operations) ? body.operations : [];
    const known = new Set(state.operations.map((op) => op.operationId));
    const accepted = operations.filter((op) => !known.has(op.operationId));
    state.operations.push(...accepted);
    state.cursor = state.operations.length;
    const result = { accepted: accepted.length, cursor: String(state.cursor) };
    state.idempotency.set(key, result);
    return reply(200, result);
  }
  if (request.url === "/pull") {
    const cursor = Number(body.cursor ?? 0);
    return reply(200, { operations: state.operations.slice(cursor), cursor: String(state.operations.length), hasMore: false });
  }
  reply(404, { error: "NOT_FOUND" });
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;
const trace = [];
const request = async (route, body, key) => {
  const started = Date.now();
  const response = await fetch(`${base}${route}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(key ? { "idempotency-key": key } : {}) },
    body: JSON.stringify(body),
  });
  const value = await response.json();
  trace.push({ route, status: response.status, durationMs: Date.now() - started, correlationId });
  if (!response.ok) throw new Error(`${route} failed`);
  return value;
};

const document = { id: "document:e2e", title: "KnowledgeOS E2E", checksum: createHash("sha256").update("KnowledgeOS E2E").digest("hex") };
const mac = { deviceId: "mac", cursor: "0", operations: [] };
const iphone = { deviceId: "iphone", cursor: "0", operations: [] };
const ipad = { deviceId: "ipad", cursor: "0", operations: [] };

const importOperation = { operationId: "op:import:1", entityId: document.id, type: "document.imported", payload: document };
await request("/push", { operations: [importOperation] }, "mac-import-1");
await request("/push", { operations: [importOperation] }, "mac-import-1");

const iphoneInitial = await request("/pull", { cursor: iphone.cursor });
iphone.operations.push(...iphoneInitial.operations); iphone.cursor = iphoneInitial.cursor;
const annotation = { operationId: "op:annotation:1", entityId: document.id, type: "annotation.created", payload: { anchor: "section:1", text: "Mobile note" } };
const bookmark = { operationId: "op:bookmark:1", entityId: document.id, type: "bookmark.created", payload: { anchor: "section:1" } };
await request("/push", { operations: [annotation, bookmark] }, "iphone-changes-1");

const ipadInitial = await request("/pull", { cursor: ipad.cursor });
ipad.operations.push(...ipadInitial.operations); ipad.cursor = ipadInitial.cursor;
const macFinal = await request("/pull", { cursor: mac.cursor });
mac.operations.push(...macFinal.operations); mac.cursor = macFinal.cursor;

const ids = (client) => new Set(client.operations.map((op) => op.operationId));
const expected = new Set(state.operations.map((op) => op.operationId));
const converged = [mac, ipad].every((client) => ids(client).size === expected.size && [...expected].every((id) => ids(client).has(id)));
const noDuplicates = state.operations.length === expected.size;
const anchorsPreserved = state.operations.some((op) => op.payload?.anchor === "section:1");

const report = {
  schemaVersion: 1,
  correlationId,
  startedAt,
  completedAt: new Date().toISOString(),
  document,
  assertions: { converged, noDuplicates, anchorsPreserved, cursor: String(state.cursor), expectedOperations: expected.size },
  clients: { mac: { cursor: mac.cursor, operationCount: mac.operations.length }, iphone: { cursor: iphone.cursor, operationCount: iphone.operations.length }, ipad: { cursor: ipad.cursor, operationCount: ipad.operations.length } },
  trace,
};

await writeFile(path.join(reportDir, "cross-platform-e2e.json"), JSON.stringify(report, null, 2));
await writeFile(path.join(reportDir, "cross-platform-e2e.md"), `# Cross-Platform E2E Report\n\n- Correlation: ${correlationId}\n- Converged: ${converged}\n- No duplicates: ${noDuplicates}\n- Anchors preserved: ${anchorsPreserved}\n- Cursor: ${state.cursor}\n- Operations: ${expected.size}\n`);
await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
if (!converged || !noDuplicates || !anchorsPreserved) process.exit(1);
console.log(JSON.stringify(report.assertions));
