import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  startLocalLibrary,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-local-production-"),
);

try {
  const running =
    await startLocalLibrary({
      root,
      databasePath:
        join(root, "library.sqlite"),
      storagePath:
        join(root, "storage"),
      localLibraryId:
        "local-library:production",
      maximumOfflineBytes:
        1024 * 1024,
      minimumFreeBytes:
        0,
      preserveRecentlyAccessedCount:
        10,
    });

  await running.publications.save({
    localLibraryId:
      "local-library:production",
    publicationId:
      "publication:production-1",
    knowledgeObjectId:
      "knowledge-object:production-1",
    versionId:
      "version:production-1",
    sourceItemId:
      "source-item:production-1",
    title:
      "Local Production",
    mediaType:
      "application/pdf",
    byteLength:
      0,
    contentFingerprint:
      "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    relativePath:
      "",
    acquisitionStatus:
      "evicted",
    readableOffline:
      false,
    pinned:
      false,
  });

  const maintenance =
    await running.runMaintenance();

  assert.equal(
    maintenance.length,
    4,
  );

  const manifest =
    await running.manifests.get(
      "local-library:production",
    );

  assert.equal(
    manifest.entries.length,
    1,
  );

  const statistics =
    await running.statistics.calculate(
      "local-library:production",
    );

  assert.equal(
    statistics.publicationCount,
    1,
  );

  running.close();

  console.log(JSON.stringify({
    flow:
      "local-production-sqlite-storage-maintenance-manifest",
    status: "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
