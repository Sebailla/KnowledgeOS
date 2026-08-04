import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryWorkspacePersistence,
  WorkspaceEngine,
  WorkspaceManager,
  WorkspaceSession,
  createSinglePanelLayout,
} from "../src/index.js";
import {
  CancellationNone,
} from "@knowledgeos/kernel";

const panel = {
  id: "panel:1",
  kind: "document" as const,
  title: "Document",
  resourceId: "document:1",
  metadata: {},
};

const layout =
  createSinglePanelLayout(panel);

test("manager creates workspace", async () => {
  const manager =
    new WorkspaceManager({
      persistence:
        new InMemoryWorkspacePersistence(),
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  const state =
    await manager.create(
      "workspace:1",
      "Research",
      layout,
    );

  assert.equal(state.name, "Research");
});

test("manager updates workspace", async () => {
  const persistence =
    new InMemoryWorkspacePersistence();

  const manager =
    new WorkspaceManager({
      persistence,
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  await manager.create(
    "workspace:1",
    "Research",
    layout,
  );

  const updated =
    await manager.update(
      "workspace:1",
      {
        name: "Reading",
      },
    );

  assert.equal(updated.name, "Reading");
});

test("session restores workspace", async () => {
  const manager =
    new WorkspaceManager({
      persistence:
        new InMemoryWorkspacePersistence(),
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  await manager.create(
    "workspace:1",
    "Research",
    layout,
  );

  const session =
    new WorkspaceSession(manager);

  const state =
    await session.open("workspace:1");

  assert.equal(
    state.layout.focusedPanelId,
    "panel:1",
  );
});

test("session supports undo", async () => {
  const manager =
    new WorkspaceManager({
      persistence:
        new InMemoryWorkspacePersistence(),
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  await manager.create(
    "workspace:1",
    "Research",
    layout,
  );

  const session =
    new WorkspaceSession(manager);

  await session.open("workspace:1");
  await session.rename("Reading");
  await session.undo();

  assert.equal(
    session.state?.name,
    "Research",
  );
});

test("persistence lists workspaces", async () => {
  const persistence =
    new InMemoryWorkspacePersistence();

  const manager =
    new WorkspaceManager({
      persistence,
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  await manager.create(
    "workspace:2",
    "Zulu",
    layout,
  );

  await manager.create(
    "workspace:1",
    "Alpha",
    layout,
  );

  const states =
    await manager.list();

  assert.deepEqual(
    states.map((state) => state.name),
    ["Alpha", "Zulu"],
  );
});

test("layout factory creates active tab", () => {
  assert.equal(
    layout.root.kind,
    "leaf",
  );

  if (layout.root.kind === "leaf") {
    assert.equal(
      layout.root.activeTabId,
      "tab:panel:1",
    );
  }
});

test("workspace engine follows lifecycle", async () => {
  const engine =
    new WorkspaceEngine(
      new InMemoryWorkspacePersistence(),
    );

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  const session =
    engine.createSession();

  await engine.manager.create(
    "workspace:1",
    "Research",
    layout,
  );

  await session.open("workspace:1");

  assert.equal(
    session.state?.id,
    "workspace:1",
  );

  await engine.stop(context);
  await engine.dispose(context);
});
