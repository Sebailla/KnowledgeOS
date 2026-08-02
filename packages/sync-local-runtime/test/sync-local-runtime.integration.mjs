import assert from "node:assert/strict";
import {
  createHash,
} from "node:crypto";
import {
  CommitLocalAcquisitionService,
  InMemoryLocalPublicationRepository,
} from "@knowledgeos/local-library";
import {
  InMemoryResumableLocalStaging,
  InMemoryTransferDescriptorRepository,
  InMemoryTransferStateRepository,
  SyncToLocalTransferExecutor,
} from "../dist/index.js";

class MemoryContentStore {
  constructor() {
    this.values = new Map();
  }

  async stage(data) {
    const fingerprint =
      "sha256:" +
      createHash("sha256")
        .update(data)
        .digest("hex");

    return {
      stagingId:
        "local-stage",
      temporaryPath:
        "local-stage",
      contentFingerprint:
        fingerprint,
      byteLength:
        data.byteLength,
      data,
    };
  }

  async commit(staged) {
    const relativePath =
      "objects/" +
      staged.contentFingerprint
        .replace("sha256:", "");

    this.values.set(
      relativePath,
      staged.data,
    );

    return {
      relativePath,
    };
  }

  async read(relativePath) {
    return this.values.get(
      relativePath,
    );
  }

  async delete(relativePath) {
    this.values.delete(relativePath);
  }

  async verify(
    relativePath,
    fingerprint,
    byteLength,
  ) {
    const value =
      this.values.get(relativePath);

    if (!value) return false;

    const actual =
      "sha256:" +
      createHash("sha256")
        .update(value)
        .digest("hex");

    return (
      actual === fingerprint &&
      value.byteLength === byteLength
    );
  }
}

const bytes = Buffer.from(
  "master-to-local-resumable-transfer",
);
const fingerprint =
  "sha256:" +
  createHash("sha256")
    .update(bytes)
    .digest("hex");

const descriptors =
  new InMemoryTransferDescriptorRepository();
const states =
  new InMemoryTransferStateRepository();
const staging =
  new InMemoryResumableLocalStaging();
const publications =
  new InMemoryLocalPublicationRepository();
const content =
  new MemoryContentStore();

await descriptors.save({
  transferId:
    "sync-transfer:local-1",
  planId:
    "sync-plan:local-1",
  localLibraryId:
    "local-library:macbook",
  publicationId:
    "publication:local-sync-1",
  knowledgeObjectId:
    "knowledge-object:local-sync-1",
  versionId:
    "version:local-sync-1",
  sourceItemId:
    "source-item:local-sync-1",
  title:
    "Master to Local",
  mediaType:
    "application/pdf",
  byteLength:
    bytes.byteLength,
  contentFingerprint:
    fingerprint,
});

const source = {
  async describe() {
    return {
      byteLength:
        bytes.byteLength,
      contentFingerprint:
        fingerprint,
      mediaType:
        "application/pdf",
    };
  },

  async readRange(
    _publicationId,
    _versionId,
    start,
    endInclusive,
  ) {
    return bytes.subarray(
      start,
      endInclusive + 1,
    );
  },
};

const acquisition =
  new CommitLocalAcquisitionService(
    publications,
    content,
    () =>
      "2026-08-01T00:00:00.000Z",
  );

const executor =
  new SyncToLocalTransferExecutor(
    descriptors,
    states,
    source,
    staging,
    acquisition,
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
    {
      chunkBytes: 7,
    },
  );

const partialController =
  new AbortController();

let reads = 0;
const interruptingSource = {
  async describe(
    publicationId,
    versionId,
  ) {
    return source.describe(
      publicationId,
      versionId,
    );
  },

  async readRange(
    publicationId,
    versionId,
    start,
    endInclusive,
  ) {
    const result =
      await source.readRange(
        publicationId,
        versionId,
        start,
        endInclusive,
      );

    reads += 1;
    if (reads === 2) {
      partialController.abort();
    }

    return result;
  },
};

const interruptedExecutor =
  new SyncToLocalTransferExecutor(
    descriptors,
    states,
    interruptingSource,
    staging,
    acquisition,
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
    {
      chunkBytes: 7,
    },
  );

const interrupted =
  await interruptedExecutor.execute(
    "sync-transfer:local-1",
    partialController.signal,
  );

assert.equal(
  interrupted.completed,
  false,
);
assert.ok(
  interrupted.receivedBytes > 0,
);
assert.ok(
  interrupted.receivedBytes <
  interrupted.totalBytes,
);

const resumed =
  await executor.execute(
    "sync-transfer:local-1",
  );

assert.equal(
  resumed.completed,
  true,
);
assert.equal(
  resumed.checksumVerified,
  true,
);

const local =
  await publications.get(
    "local-library:macbook",
    "publication:local-sync-1",
  );

assert.equal(
  local.readableOffline,
  true,
);
assert.equal(
  local.acquisitionStatus,
  "available",
);

const stored =
  await content.read(
    local.relativePath,
  );

assert.equal(
  Buffer.from(stored).toString("utf8"),
  "master-to-local-resumable-transfer",
);

console.log(JSON.stringify({
  flow:
    "master-range-resume-verify-local-commit",
  status:
    "passed",
  receivedBytes:
    resumed.receivedBytes,
}));
