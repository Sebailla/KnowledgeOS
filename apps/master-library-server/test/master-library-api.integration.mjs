import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  AddMasterPublicationVersionService,
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
import { PassthroughUnitOfWork } from "@knowledgeos/kernel";
import {
  createMasterLibraryApplication,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-master-api-"),
);

try {
  const publications =
    new InMemoryMasterPublicationRepository();
  const versions =
    new InMemoryMasterPublicationVersionRepository();
  const registrationService =
    new RegisterMasterPublicationService(
      publications,
      versions,
      versions,
    );
  const storage =
    new MasterPublicationStorage(
      root,
      new InMemoryMasterStorageCatalog(),
    );
  const workflow =
    new MasterRegistrationWorkflow(
      storage,
      registrationService,
      new PassthroughUnitOfWork(),
      {
        async append() {
          return;
        },
      },
    );
  const addVersion =
    new AddMasterPublicationVersionService(
      publications,
      versions,
      versions,
    );

  const app = createMasterLibraryApplication({
    registration: workflow,
    addVersion,
    publications,
    versions,
    storage,
  });

  const register = await app.router.handle({
    method: "POST",
    path: "/v1/master-library/publications",
    headers: {},
    body: {
      publicationId: "publication:api-0001",
      knowledgeObjectId:
        "knowledge-object:api-0001",
      sourceItemId: "source-item:api-0001",
      versionId: "version:api-0001",
      title: "Master API Publication",
      authors: ["KnowledgeOS Team"],
      mediaType: "application/pdf",
      contentBase64: Buffer.from(
        "master api content",
      ).toString("base64"),
    },
  });

  assert.equal(register.status, 201);

  const publication = await app.router.handle({
    method: "GET",
    path:
      "/v1/master-library/publications/" +
      encodeURIComponent("publication:api-0001"),
    headers: {},
  });
  assert.equal(publication.status, 200);
  assert.equal(
    publication.body.title,
    "Master API Publication",
  );

  const versionList = await app.router.handle({
    method: "GET",
    path:
      "/v1/master-library/publications/" +
      encodeURIComponent("publication:api-0001") +
      "/versions",
    headers: {},
  });
  assert.equal(versionList.status, 200);
  assert.equal(versionList.body.items.length, 1);

  const content = await app.router.handle({
    method: "GET",
    path:
      "/v1/master-library/publications/" +
      encodeURIComponent("publication:api-0001") +
      "/versions/" +
      encodeURIComponent("version:api-0001") +
      "/content",
    headers: {},
  });
  assert.equal(content.status, 200);
  assert.equal(
    Buffer.from(
      content.body.contentBase64,
      "base64",
    ).toString("utf8"),
    "master api content",
  );

  console.log(JSON.stringify({
    flow: "master-library-api-register-query-download",
    status: "passed",
    publicationId: "publication:api-0001",
  }));
} finally {
  await rm(root, { recursive: true, force: true });
}
