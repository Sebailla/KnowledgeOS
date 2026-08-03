import assert from "node:assert/strict";
import {
  PostgresUploadCompletionLeaseRepository,
  PostgresUploadCompletionRepository,
} from "../dist/index.js";

class FakeSql {
  constructor() {
    this.leases = new Map();
    this.completions = new Map();
  }

  async query(sql, parameters = []) {
    if (
      sql.includes(
        "insert into master_upload_completion_leases",
      )
    ) {
      const [sessionId, ownerId, expiresAt] =
        parameters;
      const current = this.leases.get(sessionId);
      if (
        !current ||
        Date.parse(current.expiresAt) <
          Date.now()
      ) {
        this.leases.set(sessionId, {
          ownerId,
          expiresAt,
        });
        return {
          rows: [{ session_id: sessionId }],
          rowCount: 1,
        };
      }
      return { rows: [], rowCount: 0 };
    }

    if (
      sql.includes(
        "delete from master_upload_completion_leases",
      )
    ) {
      const [sessionId, ownerId] =
        parameters;
      const current =
        this.leases.get(sessionId);
      if (
        current?.ownerId === ownerId
      ) {
        this.leases.delete(sessionId);
      }
      return { rows: [], rowCount: 1 };
    }

    if (
      sql.includes(
        "insert into master_upload_completions",
      )
    ) {
      const [
        sessionId,
        publicationId,
        versionId,
        completedAt,
      ] = parameters;
      if (!this.completions.has(sessionId)) {
        this.completions.set(sessionId, {
          publicationId,
          versionId,
          completedAt,
        });
      }
      return { rows: [], rowCount: 1 };
    }

    if (
      sql.includes(
        "from master_upload_completions",
      )
    ) {
      const value =
        this.completions.get(
          parameters[0],
        );
      return value
        ? {
            rows: [{
              session_id: parameters[0],
              publication_id:
                value.publicationId,
              version_id:
                value.versionId,
              completed_at:
                value.completedAt,
            }],
            rowCount: 1,
          }
        : { rows: [], rowCount: 0 };
    }

    return { rows: [], rowCount: 0 };
  }
}

const sql = new FakeSql();
const leases =
  new PostgresUploadCompletionLeaseRepository(
    sql,
  );
const completions =
  new PostgresUploadCompletionRepository(
    sql,
  );

assert.equal(
  await leases.tryAcquire(
    "session:1",
    "server:a",
    new Date(
      Date.now() + 60_000,
    ).toISOString(),
  ),
  true,
);

assert.equal(
  await leases.tryAcquire(
    "session:1",
    "server:b",
    new Date(
      Date.now() + 60_000,
    ).toISOString(),
  ),
  false,
);

await leases.release(
  "session:1",
  "server:a",
);

assert.equal(
  await leases.tryAcquire(
    "session:1",
    "server:b",
    new Date(
      Date.now() + 60_000,
    ).toISOString(),
  ),
  true,
);

await completions.save({
  sessionId: "session:1",
  publicationId: "publication:1",
  versionId: "version:1",
  completedAt:
    "2026-08-01T00:00:00.000Z",
});

const completion =
  await completions.get(
    "session:1",
  );

assert.equal(
  completion.publicationId,
  "publication:1",
);

console.log(JSON.stringify({
  flow:
    "postgres-upload-session-leases-idempotency",
  status: "passed",
}));
