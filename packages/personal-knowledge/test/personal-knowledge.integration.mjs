import assert from "node:assert/strict";
import {
  InMemoryPersonalKnowledgeRepository,
  InMemoryPersonalKnowledgeRevisionRepository,
  PassthroughPersonalKnowledgeUnitOfWork,
  PersonalKnowledgeService,
} from "../dist/index.js";

const items =
  new InMemoryPersonalKnowledgeRepository();
const revisions =
  new InMemoryPersonalKnowledgeRevisionRepository();

const service =
  new PersonalKnowledgeService(
    items,
    revisions,
    new PassthroughPersonalKnowledgeUnitOfWork(),
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

const created =
  await service.create({
    itemId: "pk:note-1",
    ownerId: "user:1",
    knowledgeObjectId:
      "knowledge-object:1",
    type: "highlight",
    anchor: {
      kind: "text",
      publicationId:
        "publication:1",
      versionId:
        "version:1",
      startOffset: 10,
      endOffset: 20,
      selectedText:
        "important",
    },
    body:
      "Key idea",
    tags:
      ["research"],
    color:
      "yellow",
  });

assert.equal(created.revision, 1);

const updated =
  await service.update({
    itemId: created.itemId,
    ownerId: "user:1",
    expectedRevision: 1,
    body:
      "Updated key idea",
  });

assert.equal(updated.revision, 2);

await assert.rejects(
  () =>
    service.update({
      itemId: created.itemId,
      ownerId: "user:1",
      expectedRevision: 1,
      body:
        "stale update",
    }),
);

const deleted =
  await service.remove(
    created.itemId,
    "user:1",
    2,
  );

assert.equal(deleted.deleted, true);
assert.equal(deleted.revision, 3);

const history =
  await revisions.list(
    created.itemId,
  );

assert.equal(history.length, 3);

console.log(JSON.stringify({
  flow:
    "personal-knowledge-create-update-conflict-delete-history",
  status:
    "passed",
  revisions:
    history.length,
}));
