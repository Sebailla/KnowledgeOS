import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryPluginProvider,
  PluginCompatibility,
  PluginDependencyResolver,
  PluginEngine,
  PluginManager,
  PluginManifestValidator,
  PluginRegistry,
} from "../src/index.js";
import {
  CancellationNone,
} from "@knowledgeos/kernel";

const manifest = {
  id: "plugin.example",
  name: "Example",
  version: "1.0.0",
  apiVersion: "1.0.0",
  entrypoint: "index.js",
  capabilities: [
    "workspace.panel",
  ] as const,
  permissions: [
    "workspace.read",
  ] as const,
  dependencies: [],
  metadata: {},
};

test("manifest validator accepts valid manifest", () => {
  new PluginManifestValidator()
    .validate(manifest);

  assert.equal(true, true);
});

test("compatibility rejects different major version", () => {
  assert.throws(
    () =>
      new PluginCompatibility("1.0.0")
        .assertCompatible({
          ...manifest,
          apiVersion: "2.0.0",
        }),
  );
});

test("dependency resolver orders dependencies", () => {
  const dependency = {
    ...manifest,
    id: "plugin.base",
  };

  const dependent = {
    ...manifest,
    id: "plugin.feature",
    dependencies: [
      {
        pluginId: "plugin.base",
        versionRange: "^1.0.0",
      },
    ],
  };

  const ordered =
    new PluginDependencyResolver()
      .resolve([
        dependent,
        dependency,
      ]);

  assert.deepEqual(
    ordered.map((item) => item.id),
    [
      "plugin.base",
      "plugin.feature",
    ],
  );
});

test("dependency resolver detects cycles", () => {
  const first = {
    ...manifest,
    id: "plugin.a",
    dependencies: [
      {
        pluginId: "plugin.b",
        versionRange: "1.0.0",
      },
    ],
  };

  const second = {
    ...manifest,
    id: "plugin.b",
    dependencies: [
      {
        pluginId: "plugin.a",
        versionRange: "1.0.0",
      },
    ],
  };

  assert.throws(
    () =>
      new PluginDependencyResolver()
        .resolve([first, second]),
  );
});

test("manager installs and activates plugin", async () => {
  let activated = false;

  const provider =
    new InMemoryPluginProvider();

  provider.register(
    manifest.id,
    {
      async activate() {
        activated = true;
      },
      async deactivate() {},
    },
  );

  const manager =
    new PluginManager({
      provider,
      registry:
        new PluginRegistry(),
      validator:
        new PluginManifestValidator(),
      compatibility:
        new PluginCompatibility("1.0.0"),
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  manager.install(manifest);

  const descriptor =
    await manager.activate(
      manifest.id,
    );

  assert.equal(activated, true);
  assert.equal(
    descriptor.state,
    "active",
  );
});

test("manager deactivates and uninstalls plugin", async () => {
  let deactivated = false;

  const provider =
    new InMemoryPluginProvider();

  provider.register(
    manifest.id,
    {
      async activate() {},
      async deactivate() {
        deactivated = true;
      },
    },
  );

  const registry =
    new PluginRegistry();

  const manager =
    new PluginManager({
      provider,
      registry,
      validator:
        new PluginManifestValidator(),
      compatibility:
        new PluginCompatibility("1.0.0"),
      now: () =>
        "2026-08-03T00:00:00.000Z",
    });

  manager.install(manifest);
  await manager.activate(manifest.id);
  await manager.uninstall(manifest.id);

  assert.equal(deactivated, true);
  assert.equal(
    registry.get(manifest.id),
    undefined,
  );
});

test("plugin engine follows lifecycle", async () => {
  const engine =
    new PluginEngine(
      new InMemoryPluginProvider(),
    );

  const context = {
    cancellation: CancellationNone,
    metadata: {},
  };

  await engine.initialize(context);
  await engine.start(context);

  engine.assertRunning();

  await engine.stop(context);
  await engine.dispose(context);
});
