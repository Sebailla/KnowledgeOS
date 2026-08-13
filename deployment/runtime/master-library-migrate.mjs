import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  PgSqlClient, MigrationRunner, initialMasterLibraryMigration, durableProcessingMigration, catalogMetadataMigration, acquisitionReceiptMigration, ingestJournalMigration, ingestPromotionMigration,
  PostgresMasterStorageCatalog, PostgresOperationJournal, AuthorityReconciler, PostgresAuthoritativeIngestRepository, AuthoritativeIngestService,
} from '/app/workspace/packages/master-storage/dist/index.js';

const databaseUrl = process.env.DATABASE_URL;
const passwordFile = process.env.POSTGRES_PASSWORD_FILE ?? '/run/secrets/postgres_password';
if (!databaseUrl) throw new Error('DATABASE_URL is required for the one-shot migration runner.');
const password = (await readFile(passwordFile, 'utf8')).trim();
const database = new URL(databaseUrl);
const client = new PgSqlClient({ host: database.hostname, port: Number(database.port || 5432), database: database.pathname.slice(1), user: decodeURIComponent(database.username), password });
try {
  const applied = await new MigrationRunner(client).apply([initialMasterLibraryMigration, durableProcessingMigration, catalogMetadataMigration, acquisitionReceiptMigration, ingestJournalMigration, ingestPromotionMigration]);
  const catalog = new PostgresMasterStorageCatalog(client);
  const journal = new PostgresOperationJournal(client);
  if (process.env.MASTER_LIBRARY_RECONCILIATION_FIXTURE === 'orphan') {
    await catalog.save({ publicationId: 'pr5-publication', versionId: 'v1', sourceItemId: 'pr5-source', mediaType: 'text/plain', byteLength: 0, contentFingerprint: 'sha256:pr5-orphan', relativePath: 'missing/pr5.txt' });
    await journal.record({ operationId: 'pr5-orphan', publicationId: 'pr5-publication', versionId: 'v1', state: 'cataloged', fingerprint: 'sha256:pr5-orphan' });
  }
  const records = await client.query('SELECT operation_id, publication_id, version_id, state, content_fingerprint FROM master_operations');
  const reconciler = new AuthorityReconciler({
    async inspect(operation) {
      const found = await catalog.get(operation.publicationId, operation.versionId);
      return { staged: operation.state === 'staged', published: false, catalog: Boolean(found), fingerprint: found?.contentFingerprint };
    },
  }, journal);
  const reconciled = [];
  for (const row of records.rows) reconciled.push({ operationId: row.operation_id, decision: await reconciler.recover({ operationId: row.operation_id, publicationId: row.publication_id, versionId: row.version_id, state: row.state, fingerprint: row.content_fingerprint }) });
  if (process.env.MASTER_LIBRARY_INGEST_ENABLED === 'true') {
    const limit = Number(process.env.MASTER_LIBRARY_INGEST_MAX_BYTES ?? '104857600');
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error('MASTER_LIBRARY_INGEST_MAX_BYTES must be a positive integer.');
    await new AuthoritativeIngestService(new PostgresAuthoritativeIngestRepository(client), process.env.MASTER_LIBRARY_FILES_ROOT ?? '/var/lib/knowledgeos/master-library', { maxBytes: limit }).reconcile();
  }
  const operationsRoot = process.env.OPERATIONS_ROOT ?? '/var/lib/knowledgeos/operations';
  await mkdir(operationsRoot, { recursive: true });
  await writeFile(join(operationsRoot, 'reconciliation-ready'), `${JSON.stringify({ reconciled })}\n`, { encoding: 'utf8', mode: 0o600 });
  await writeFile(join(operationsRoot, 'migration-ready'), `${JSON.stringify({ applied, runner: 'master-storage-pg' })}\n`, { encoding: 'utf8', mode: 0o600 });
} finally { await client.close(); }
