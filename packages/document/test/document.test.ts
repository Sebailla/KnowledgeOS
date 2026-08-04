import assert from "node:assert/strict";
import test from "node:test";
import { CancellationNone } from "@knowledgeos/kernel";
import {
  DocumentEngine,
  DocumentManager,
  InMemoryDocumentLockManager,
  InMemoryDocumentRepository,
  JsonDocumentSerializer,
  documentToSearchProjection,
} from "../src/index.js";

const metadata = { title: "KnowledgeOS", mimeType: "text/markdown", tags: ["pkm"], attributes: {} };
const deps = () => ({ repository: new InMemoryDocumentRepository(), now: () => "2026-08-03T00:00:00.000Z", checksum: (value: string) => `sum:${value.length}` });

test("manager creates document", async () => {
  const manager = new DocumentManager(deps());
  const doc = await manager.create("doc:1", "hello", metadata);
  assert.equal(doc.version, 1);
  assert.equal(doc.revision.content, "hello");
});

test("manager creates revisions", async () => {
  const manager = new DocumentManager(deps());
  await manager.create("doc:1", "one", metadata);
  const doc = await manager.revise("doc:1", "two", metadata);
  assert.equal(doc.version, 2);
  assert.equal(doc.history.length, 2);
});

test("document restores prior revision", async () => {
  const manager = new DocumentManager(deps());
  await manager.create("doc:1", "one", metadata);
  await manager.revise("doc:1", "two", metadata);
  const doc = await manager.restore("doc:1", 1);
  assert.equal(doc.revision.content, "one");
});

test("repository detects optimistic conflict", async () => {
  const repository = new InMemoryDocumentRepository();
  const manager = new DocumentManager({ repository, now: () => "2026-08-03T00:00:00.000Z", checksum: (value) => value });
  const doc = await manager.create("doc:1", "one", metadata);
  await assert.rejects(() => repository.save(doc.snapshot(), 0));
});

test("serializer round trips snapshot", async () => {
  const manager = new DocumentManager(deps());
  const doc = await manager.create("doc:1", "one", metadata);
  const serializer = new JsonDocumentSerializer();
  const restored = serializer.deserialize(serializer.serialize(doc.snapshot()));
  assert.equal(restored.documentId, "doc:1");
});

test("engine session locks and edits document", async () => {
  const repository = new InMemoryDocumentRepository();
  const engine = new DocumentEngine(repository, new InMemoryDocumentLockManager(), () => "2026-08-03T00:00:00.000Z");
  const context = { cancellation: CancellationNone, metadata: {} };
  await engine.initialize(context);
  await engine.start(context);
  await engine.manager.create("doc:1", "one", metadata);
  const session = engine.createSession("user:1");
  await session.open("doc:1");
  await session.revise("two", metadata);
  assert.equal(session.current?.revision.content, "two");
  await session.close();
});

test("document projects to search", async () => {
  const manager = new DocumentManager(deps());
  const doc = await manager.create("doc:1", "body", metadata);
  const projection = documentToSearchProjection(doc);
  assert.equal(projection.title, "KnowledgeOS");
  assert.equal(projection.body, "body");
});
