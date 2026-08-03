import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
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
} from "@knowledgeos/master-storage";
import {
  MasterRegistrationWorkflow,
} from "@knowledgeos/master-registration-workflow";
import {
  PassthroughUnitOfWork,
} from "@knowledgeos/kernel";
import {
  FileUploadSessionStore,
  ResumableUploadService,
  sha256Hex,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-resumable-"),
);
const sessionRoot = join(root, "sessions");
const objectRoot = join(root, "objects-root");

try {
  const publications =
    new InMemoryMasterPublicationRepository();
  const versions =
    new InMemoryMasterPublicationVersionRepository();
  const registration =
    new RegisterMasterPublicationService(
      publications,
      versions,
      versions,
    );
  const storage =
    new MasterPublicationStorage(
      objectRoot,
      new InMemoryMasterStorageCatalog(),
    );
  const workflow =
    new MasterRegistrationWorkflow(
      storage,
      registration,
      new PassthroughUnitOfWork(),
      {
        async append() {
          return;
        },
      },
    );

  const service = new ResumableUploadService(
    new FileUploadSessionStore(
      sessionRoot,
    ),
    workflow,
  );

  const all = Buffer.from(
    "abcdefghijklmnopqrstuvwxyz0123456789",
  );
  const chunks = [
    all.subarray(0, 10),
    all.subarray(10, 20),
    all.subarray(20),
  ];

  const session = await service.createSession({
    publicationId: "publication:resumable-0001",
    knowledgeObjectId:
      "knowledge-object:resumable-0001",
    sourceItemId:
      "source-item:resumable-0001",
    versionId:
      "version:resumable-0001",
    title: "Resumable Publication",
    authors: ["KnowledgeOS Team"],
    mediaType: "application/pdf",
    expectedByteLength: all.byteLength,
    expectedChunkCount: chunks.length,
  });

  await service.putChunk(
    session.sessionId,
    1,
    chunks[1],
    sha256Hex(chunks[1]),
  );
  await service.putChunk(
    session.sessionId,
    0,
    chunks[0],
    sha256Hex(chunks[0]),
  );

  const interrupted =
    await service.getProgress(
      session.sessionId,
    );
  assert.deepEqual(
    interrupted.missingChunkIndexes,
    [2],
  );

  await service.putChunk(
    session.sessionId,
    2,
    chunks[2],
    sha256Hex(chunks[2]),
  );

  const completed =
    await service.complete(
      session.sessionId,
    );

  assert.equal(
    completed.publicationId,
    "publication:resumable-0001",
  );

  const publication =
    await publications.getById(
      completed.publicationId,
    );
  assert.equal(
    publication.title,
    "Resumable Publication",
  );

  console.log(JSON.stringify({
    flow:
      "resumable-session-out-of-order-chunks-resume-complete",
    status: "passed",
    chunks: chunks.length,
    byteLength: all.byteLength,
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
