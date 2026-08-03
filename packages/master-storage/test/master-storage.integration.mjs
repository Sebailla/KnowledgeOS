import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  InMemoryMasterPublicationRepository,
  InMemoryMasterPublicationVersionRepository,
  RegisterMasterPublicationService,
} from "@knowledgeos/master-library";
import {
  InMemoryMasterStorageCatalog,
  MasterPublicationStorage,
  OrphanScanner,
  RegisterStoredPublicationService,
} from "../dist/index.js";

const root = await mkdtemp(join(tmpdir(), "knowledgeos-master-storage-"));

try {
  const catalog = new InMemoryMasterStorageCatalog();
  const storage = new MasterPublicationStorage(root, catalog);
  const publications = new InMemoryMasterPublicationRepository();
  const versions = new InMemoryMasterPublicationVersionRepository();
  const registerLibrary = new RegisterMasterPublicationService(
    publications,
    versions,
    versions,
  );
  const service = new RegisterStoredPublicationService(
    storage,
    registerLibrary,
  );

  const result = await service.execute({
    publicationId: "publication:storage-0001",
    knowledgeObjectId: "knowledge-object:storage-0001",
    sourceItemId: "source-item:storage-0001",
    versionId: "version:storage-0001",
    title: "Stored Publication",
    authors: ["KnowledgeOS Team"],
    mediaType: "application/pdf",
    data: Buffer.from("authoritative publication bytes"),
  });

  assert.equal(result.library.publication.status, "available");
  assert.equal(
    result.storage.contentFingerprint,
    "sha256:c4df7306c3b75426c2857bfc9885bdf944a41ae4f0fbf5dfb56d3d45281c8abf",
  );

  const bytes = await storage.read(
    result.storage.publicationId,
    result.storage.versionId,
  );
  assert.equal(
    Buffer.from(bytes).toString("utf8"),
    "authoritative publication bytes",
  );

  assert.equal(
    await storage.verify(
      result.storage.publicationId,
      result.storage.versionId,
    ),
    true,
  );

  const orphanPath = join(
    root,
    "objects",
    "ff",
    "ff",
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  );
  await mkdir(join(root, "objects", "ff", "ff"), {
    recursive: true,
  });
  await writeFile(orphanPath, Buffer.from("orphan"));

  const orphans = await new OrphanScanner(
    root,
    catalog,
  ).scan();
  assert.equal(orphans.length, 1);

  console.log(JSON.stringify({
    flow: "master-storage-stage-commit-read-verify-orphan-scan",
    status: "passed",
    fingerprint: result.storage.contentFingerprint,
    orphans: orphans.length,
  }));
} finally {
  await rm(root, { recursive: true, force: true });
}
