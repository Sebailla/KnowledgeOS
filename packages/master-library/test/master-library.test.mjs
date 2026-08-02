import assert from "node:assert/strict";
import {
  AddMasterPublicationVersionService,
  DeduplicationService,
  InMemoryMasterPublicationRepository,
  InMemoryMasterPublicationVersionRepository,
  RegisterMasterPublicationService,
} from "../dist/index.js";

const publications =
  new InMemoryMasterPublicationRepository();
const versions =
  new InMemoryMasterPublicationVersionRepository();

const register =
  new RegisterMasterPublicationService(
    publications,
    versions,
    versions,
  );

const first = await register.execute({
  publicationId: "publication:master-0001",
  knowledgeObjectId: "knowledge-object:master-0001",
  title: "Master Library Introduction",
  authors: ["KnowledgeOS Team"],
  sourceItemId: "source-item:master-0001",
  versionId: "version:master-0001",
  contentFingerprint: "sha256:master-0001",
  metadata: { language: "en" },
});

assert.equal(first.publication.status, "available");
assert.equal(first.version.sequence, 1);

const duplicate = await register.execute({
  publicationId: "publication:master-0002",
  knowledgeObjectId: "knowledge-object:master-0002",
  title: "Duplicate",
  authors: [],
  sourceItemId: "source-item:master-0002",
  versionId: "version:master-0002",
  contentFingerprint: "sha256:master-0001",
});

assert.equal(duplicate.duplicateOf.publicationId, first.publication.publicationId);

const addVersion =
  new AddMasterPublicationVersionService(
    publications,
    versions,
    versions,
  );

const second = await addVersion.execute({
  publicationId: first.publication.publicationId,
  versionId: "version:master-0003",
  sourceItemId: "source-item:master-0003",
  contentFingerprint: "sha256:master-0003",
  parentVersionIds: [first.version.versionId],
  label: "Second edition",
});

assert.equal(second.sequence, 2);

const dedup = new DeduplicationService(versions);
const inspected = await dedup.inspect(
  "sha256:master-0003",
);
assert.equal(inspected.duplicate, true);

console.log(JSON.stringify({
  flow: "master-library-registration-versioning-deduplication",
  status: "passed",
  publicationId: first.publication.publicationId,
  versions: 2,
}));
