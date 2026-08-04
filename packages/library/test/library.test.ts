import assert from "node:assert/strict";
import test from "node:test";

import {
  Collection,
  CollectionId,
  InMemoryLibraryRepository,
  Library,
  LibraryId,
  LibraryService,
  Workspace,
  WorkspaceId,
} from "../src/index.js";

function deps() {
  let n = 0;
  return {
    nextEventId: () => `event:${++n}`,
    now: () => "2026-08-03T00:00:00.000Z",
  };
}

test("library creation records event", () => {
  const library = Library.create(LibraryId.create("library:1"), "Personal", deps());
  assert.equal(library.version, 1);
  assert.equal(library.uncommittedEvents[0]?.type, "library.created");
});

test("library adds collection and workspace", () => {
  const library = Library.create(LibraryId.create("library:1"), "Personal", deps());
  library.addCollection(new Collection(CollectionId.create("collection:1"), "Research"));
  library.addWorkspace(new Workspace(WorkspaceId.create("workspace:1"), "Reading"));
  assert.equal(library.collections.length, 1);
  assert.equal(library.workspaces.length, 1);
  assert.equal(library.version, 3);
});

test("collection membership is unique", () => {
  const collection = new Collection(CollectionId.create("collection:1"), "Research");
  collection.addObject("object:1");
  collection.addObject("object:1");
  assert.deepEqual(collection.members, ["object:1"]);
});

test("workspace persists layout", () => {
  const workspace = new Workspace(WorkspaceId.create("workspace:1"), "Research");
  workspace.updateLayout({
    panels: ["reader", "notes"],
    activeDocumentId: "object:1",
    metadata: { mode: "research" },
  });
  assert.equal(workspace.layout.activeDocumentId, "object:1");
});

test("service persists library", async () => {
  const repository = new InMemoryLibraryRepository();
  const service = new LibraryService({ repository, ...deps() });
  const id = LibraryId.create("library:1");
  await service.createLibrary(id, "Personal");
  assert.equal((await repository.get(id))?.name, "Personal");
});

test("service adds collection", async () => {
  const repository = new InMemoryLibraryRepository();
  const service = new LibraryService({ repository, ...deps() });
  const libraryId = LibraryId.create("library:1");
  await service.createLibrary(libraryId, "Personal");
  await service.addCollection(
    libraryId,
    CollectionId.create("collection:1"),
    "Papers",
  );
  assert.equal((await repository.get(libraryId))?.collections.length, 1);
});

test("duplicate collection is rejected", () => {
  const library = Library.create(LibraryId.create("library:1"), "Personal", deps());
  const collection = new Collection(CollectionId.create("collection:1"), "Research");
  library.addCollection(collection);
  assert.throws(() => library.addCollection(collection));
});
