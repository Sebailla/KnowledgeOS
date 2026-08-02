import assert from "node:assert/strict";
import {
  InMemoryLocalPublicationRepository,
} from "@knowledgeos/local-library";
import {
  LocalRepairService,
} from "../dist/index.js";

const repository =
  new InMemoryLocalPublicationRepository();

await repository.save({
  localLibraryId:
    "local-library:repair",
  publicationId:
    "publication:repair-1",
  knowledgeObjectId:
    "knowledge-object:repair-1",
  versionId:
    "version:repair-1",
  sourceItemId:
    "source-item:repair-1",
  title:
    "Broken Publication",
  mediaType:
    "application/pdf",
  byteLength:
    100,
  contentFingerprint:
    "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  relativePath:
    "objects/bb/bb/file",
  acquisitionStatus:
    "available",
  readableOffline:
    true,
  pinned:
    false,
});

const service =
  new LocalRepairService(
    repository,
    {
      async stage() {
        throw new Error("unused");
      },
      async commit() {
        throw new Error("unused");
      },
      async read() {
        throw new Error("unused");
      },
      async delete() {
        return;
      },
      async verify() {
        return false;
      },
    },
    {
      async scan() {
        return [{
          relativePath:
            "objects/orphan",
          byteLength:
            1,
        }];
      },
    },
  );

const report =
  await service.markInvalidRecords(
    "local-library:repair",
  );

assert.equal(
  report.issues.length,
  2,
);
assert.equal(
  report.repaired.length,
  1,
);

const updated = await repository.get(
  "local-library:repair",
  "publication:repair-1",
);

assert.equal(
  updated.readableOffline,
  false,
);
assert.equal(
  updated.acquisitionStatus,
  "failed",
);

console.log(JSON.stringify({
  flow:
    "local-repair-detect-mark-invalid",
  status: "passed",
  issues:
    report.issues.length,
}));
