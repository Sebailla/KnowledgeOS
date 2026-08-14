import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  AuthoritativeIngestService,
  InMemoryAuthoritativeIngestRepository,
} from "../src/index.js";

const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const metadata = {
  title: "Recovery Book",
  authors: ["Ada Lovelace"],
  originalFilename: "recovery-book.pdf",
  declaredMediaType: "application/pdf" as const,
  byteLength: pdf.byteLength,
  acceptedProvenance: {
    title: { evidence: "pdf-info" as const, confidence: "high" as const },
    authors: [{ evidence: "user-entered" as const, confidence: "high" as const }],
  },
};

test("promotes validated bytes and registers a catalog-visible publication exactly once", async () => {
  const root = await mkdtemp(join(tmpdir(), "knowledgeos-ingest-promotion-"));
  try {
    const repository = new InMemoryAuthoritativeIngestRepository();
    const service = new AuthoritativeIngestService(repository, root, { maxBytes: 1024 });

    const accepted = await service.accept({
      subject: "operator:one",
      correlationId: "correlation:ingest-promotion",
      idempotencyKey: "ingest:promotion",
      bytes: pdf,
      metadata,
    });

    assert.equal(accepted.outcome, "registered");
    assert.equal((await repository.browse()).items.length, 1);
    assert.deepEqual((await repository.record(accepted.operationId))?.metadata.acceptedProvenance, metadata.acceptedProvenance);
    assert.deepEqual(
      await readFile(join(root, "publications", accepted.publicationId, accepted.versionId, "content")),
      Buffer.from(pdf),
    );

    const replay = await service.accept({
      subject: "operator:one",
      correlationId: "correlation:ingest-replay",
      idempotencyKey: "ingest:promotion",
      bytes: pdf,
      metadata,
    });
    assert.deepEqual(replay, accepted);
    assert.equal((await repository.browse()).items.length, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("reconciliation registers promoted bytes and preserves missing evidence without exposing it", async () => {
  const root = await mkdtemp(join(tmpdir(), "knowledgeos-ingest-recovery-"));
  try {
    const repository = new InMemoryAuthoritativeIngestRepository();
    const service = new AuthoritativeIngestService(repository, root, { maxBytes: 1024 });
    const accepted = await service.accept({
      subject: "operator:one",
      correlationId: "correlation:ingest-recovery",
      idempotencyKey: "ingest:recovery",
      bytes: pdf,
      metadata,
      interruptAfter: "promoted",
    });
    assert.equal((await repository.browse()).items.length, 0);

    await service.reconcile();
    assert.equal((await repository.browse()).items[0]?.publicationId, accepted.publicationId);

    await rm(join(root, "publications", accepted.publicationId), { recursive: true, force: true });
    await service.reconcile();
    assert.equal((await repository.status(accepted.operationId))?.state, "reconciliation-required");
    assert.equal((await repository.browse()).items.length, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
