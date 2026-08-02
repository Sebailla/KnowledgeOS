import assert from "node:assert/strict";
import {
  createHash,
} from "node:crypto";
import {
  CommitLocalAcquisitionService,
  InMemoryLocalPublicationRepository,
  LocalEvictionService,
  LocalIntegrityService,
  LocalManifestService,
  LocalPublicationAccessService,
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
      stagingId: "stage:1",
      temporaryPath: "staging/1",
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
      staged.contentFingerprint.replace(
        "sha256:",
        "",
      );
    this.values.set(
      relativePath,
      staged.data,
    );
    return { relativePath };
  }

  async read(relativePath) {
    const value =
      this.values.get(relativePath);
    if (!value) {
      throw new Error("missing");
    }
    return value;
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

const repository =
  new InMemoryLocalPublicationRepository();
const content =
  new MemoryContentStore();
const now =
  () => "2026-08-01T00:00:00.000Z";

const bytes = Buffer.from(
  "offline local publication",
);
const fingerprint =
  "sha256:" +
  createHash("sha256")
    .update(bytes)
    .digest("hex");

const acquisition =
  new CommitLocalAcquisitionService(
    repository,
    content,
    now,
  );

const record =
  await acquisition.execute({
    localLibraryId:
      "local-library:macbook",
    publicationId:
      "publication:local-0001",
    knowledgeObjectId:
      "knowledge-object:local-0001",
    versionId:
      "version:local-0001",
    sourceItemId:
      "source-item:local-0001",
    title:
      "Offline Publication",
    mediaType:
      "application/pdf",
    data:
      bytes,
    expectedFingerprint:
      fingerprint,
    expectedByteLength:
      bytes.byteLength,
  });

assert.equal(
  record.readableOffline,
  true,
);

const opened =
  await new LocalPublicationAccessService(
    repository,
    content,
    now,
  ).open(
    record.localLibraryId,
    record.publicationId,
  );

assert.equal(
  Buffer.from(opened).toString("utf8"),
  "offline local publication",
);

const manifest =
  await new LocalManifestService(
    repository,
    now,
  ).create(
    record.localLibraryId,
  );

assert.equal(
  manifest.entries.length,
  1,
);
assert.equal(
  manifest.entries[0].readableOffline,
  true,
);

const issues =
  await new LocalIntegrityService(
    repository,
    content,
  ).inspect(
    record.localLibraryId,
  );

assert.equal(
  issues.length,
  0,
);

const evicted =
  await new LocalEvictionService(
    repository,
    content,
  ).evict(
    record.localLibraryId,
    record.publicationId,
  );

assert.equal(
  evicted.readableOffline,
  false,
);
assert.equal(
  evicted.acquisitionStatus,
  "evicted",
);

console.log(JSON.stringify({
  flow:
    "local-acquisition-open-manifest-integrity-eviction",
  status:
    "passed",
  publicationId:
    record.publicationId,
}));
