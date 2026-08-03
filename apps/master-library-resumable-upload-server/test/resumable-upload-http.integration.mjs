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
  FileUploadSessionStore,
  ResumableUploadService,
  sha256Hex,
} from "@knowledgeos/master-resumable-upload";
import {
  PassthroughUnitOfWork,
} from "@knowledgeos/kernel";
import {
  ResumableUploadHttpServer,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-resumable-http-"),
);

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
      join(root, "objects"),
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
  const service =
    new ResumableUploadService(
      new FileUploadSessionStore(
        join(root, "sessions"),
      ),
      workflow,
    );
  const server =
    new ResumableUploadHttpServer(
      { service },
      {
        host: "127.0.0.1",
        port: 0,
        maximumChunkBytes: 1024,
      },
    );

  const address = await server.start();
  const base =
    `http://${address.host}:${address.port}`;

  try {
    const all = Buffer.from(
      "resumable-http-upload-content",
    );
    const chunks = [
      all.subarray(0, 8),
      all.subarray(8, 18),
      all.subarray(18),
    ];

    const create = await fetch(
      `${base}/v1/master-library/upload-sessions`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          publicationId:
            "publication:resumable-http-0001",
          knowledgeObjectId:
            "knowledge-object:resumable-http-0001",
          sourceItemId:
            "source-item:resumable-http-0001",
          versionId:
            "version:resumable-http-0001",
          title:
            "Resumable HTTP Publication",
          authors: ["KnowledgeOS Team"],
          mediaType:
            "application/pdf",
          expectedByteLength:
            all.byteLength,
          expectedChunkCount:
            chunks.length,
        }),
      },
    );
    assert.equal(create.status, 201);
    const session = await create.json();

    for (const index of [1, 0]) {
      const response = await fetch(
        `${base}/v1/master-library/upload-sessions/` +
          encodeURIComponent(session.sessionId) +
          `/chunks/${index}`,
        {
          method: "PUT",
          headers: {
            "x-chunk-sha256":
              sha256Hex(chunks[index]),
          },
          body: chunks[index],
        },
      );
      assert.equal(response.status, 200);
    }

    const progress = await fetch(
      `${base}/v1/master-library/upload-sessions/` +
        encodeURIComponent(session.sessionId),
    );
    const progressBody =
      await progress.json();
    assert.deepEqual(
      progressBody.missingChunkIndexes,
      [2],
    );

    const finalChunk = await fetch(
      `${base}/v1/master-library/upload-sessions/` +
        encodeURIComponent(session.sessionId) +
        "/chunks/2",
      {
        method: "PUT",
        headers: {
          "x-chunk-sha256":
            sha256Hex(chunks[2]),
        },
        body: chunks[2],
      },
    );
    assert.equal(finalChunk.status, 200);

    const complete = await fetch(
      `${base}/v1/master-library/upload-sessions/` +
        encodeURIComponent(session.sessionId) +
        "/complete",
      {
        method: "POST",
      },
    );
    assert.equal(complete.status, 201);

    const publication =
      await publications.getById(
        "publication:resumable-http-0001",
      );
    assert.equal(
      publication.title,
      "Resumable HTTP Publication",
    );

    console.log(JSON.stringify({
      flow:
        "http-resumable-session-chunks-resume-complete",
      status: "passed",
      chunks: chunks.length,
      byteLength: all.byteLength,
    }));
  } finally {
    await server.stop();
  }
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
