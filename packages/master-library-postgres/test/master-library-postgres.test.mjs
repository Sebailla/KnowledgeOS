import assert from "node:assert/strict";
import {
  PostgresMasterPublicationRepository,
  PostgresMasterPublicationVersionRepository,
} from "../dist/index.js";

class FakeSql {
  constructor() {
    this.queries = [];
  }

  async query(sql, parameters = []) {
    this.queries.push({ sql, parameters });

    if (sql.includes("where content_fingerprint = $1")) {
      return {
        rows: [{
          version_id: "version:pg-0001",
          publication_id: "publication:pg-0001",
          sequence: 1,
          source_item_id: "source-item:pg-0001",
          content_fingerprint: parameters[0],
          parent_version_ids: [],
          label: null,
        }],
        rowCount: 1,
      };
    }

    return { rows: [], rowCount: 0 };
  }
}

const sql = new FakeSql();
const publications =
  new PostgresMasterPublicationRepository(sql);
const versions =
  new PostgresMasterPublicationVersionRepository(sql);

await publications.save({
  publicationId: "publication:pg-0001",
  knowledgeObjectId: "knowledge-object:pg-0001",
  title: "PostgreSQL Master Publication",
  authors: ["KnowledgeOS Team"],
  status: "available",
  currentVersionId: "version:pg-0001",
  sourceItemIds: ["source-item:pg-0001"],
  metadata: { language: "en" },
});

await versions.save({
  versionId: "version:pg-0001",
  publicationId: "publication:pg-0001",
  sequence: 1,
  sourceItemId: "source-item:pg-0001",
  contentFingerprint: "sha256:pg-0001",
  parentVersionIds: [],
});

const duplicate = await versions.findPublicationVersion(
  "sha256:pg-0001",
);

assert.equal(
  duplicate.publicationId,
  "publication:pg-0001",
);
assert.equal(sql.queries.length, 3);

console.log(JSON.stringify({
  flow: "master-library-postgres-repositories",
  status: "passed",
  queries: sql.queries.length,
}));
