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
import { PassthroughUnitOfWork } from "@knowledgeos/kernel";
import {
  MasterRegistrationWorkflow,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-master-registration-"),
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
  const catalog =
    new InMemoryMasterStorageCatalog();
  const storage =
    new MasterPublicationStorage(root, catalog);
  const events = [];

  const workflow = new MasterRegistrationWorkflow(
    storage,
    registration,
    new PassthroughUnitOfWork(),
    {
      async append(event) {
        events.push(event);
      },
    },
  );

  const first = await workflow.execute({
    publicationId: "publication:workflow-0001",
    knowledgeObjectId: "knowledge-object:workflow-0001",
    sourceItemId: "source-item:workflow-0001",
    versionId: "version:workflow-0001",
    title: "Workflow Publication",
    authors: ["KnowledgeOS Team"],
    mediaType: "application/pdf",
    data: Buffer.from("master registration workflow"),
  });

  assert.equal(first.duplicate, false);
  assert.equal(events.length, 1);
  assert.equal(
    events[0].type,
    "master-library.publication-registered",
  );

  const second = await workflow.execute({
    publicationId: "publication:workflow-0002",
    knowledgeObjectId: "knowledge-object:workflow-0002",
    sourceItemId: "source-item:workflow-0002",
    versionId: "version:workflow-0002",
    title: "Duplicate Workflow Publication",
    authors: [],
    mediaType: "application/pdf",
    data: Buffer.from("master registration workflow"),
  });

  assert.equal(second.duplicate, true);
  assert.equal(events.length, 2);
  assert.equal(
    events[1].type,
    "master-library.duplicate-detected",
  );

  console.log(JSON.stringify({
    flow: "master-registration-storage-catalog-outbox",
    status: "passed",
    events: events.length,
    duplicate: second.duplicate,
  }));
} finally {
  await rm(root, { recursive: true, force: true });
}
