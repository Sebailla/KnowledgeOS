import { readFile, access } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { join } from 'node:path';
import {
  PgSqlClient, PostgresMasterStorageCatalog, PostgresMasterCatalogReader, PostgresAcquisitionReceiptRepository, PostgresAuthoritativeIngestRepository, AuthoritativeIngestService,
} from '/app/workspace/packages/master-storage/dist/index.js';
import { DirectMasterStorageReader } from '/app/workspace/packages/master-storage-node-stream/dist/index.js';
import {
  MasterDirectStreamingServer, FixtureDeliveryAuthorizer, createFixtureDeliveryBoundary,
  deliveryBoundaryFromEnvironment,
} from '/app/workspace/apps/master-library-direct-streaming-server/dist/index.js';
import { createLocalDevelopmentAuth, createLocalDevelopmentCredentialVerifier, validateLocalDevelopmentAuthEnvironment } from '/app/workspace/packages/master-library-local-development-auth/dist/index.js';
import { LocalMasterLibraryBrowserServer } from '/app/workspace/apps/master-library-local-browser/dist/index.js';
// Load only the Import Engine metadata boundary. The package index also exposes
// unrelated import pipelines and would make the local runtime depend on them.
import { inspectPublication } from '/app/workspace/packages/import/dist/metadata/inspectPublication.js';
import { TesseractPdfOcrProvider, verifyLocalOcrRuntime } from '/app/workspace/packages/ocr/dist/tesseract/TesseractPdfOcrProvider.js';

const profile = process.env.MASTER_LIBRARY_DELIVERY_PROFILE;
validateLocalDevelopmentAuthEnvironment(process.env);
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required.');
const url = new URL(databaseUrl);
const password = (await readFile(process.env.POSTGRES_PASSWORD_FILE ?? '/run/secrets/postgres_password', 'utf8')).trim();
const client = new PgSqlClient({ host: url.hostname, port: Number(url.port || 5432), database: url.pathname.slice(1), user: decodeURIComponent(url.username), password });
const catalog = new PostgresMasterStorageCatalog(client);
const reader = new DirectMasterStorageReader(process.env.MASTER_LIBRARY_FILES_ROOT ?? '/var/lib/knowledgeos/master-library', catalog);
const audit = [];
const fixtureAuthorizer = new FixtureDeliveryAuthorizer({ 'fixture-catalog-token': ['catalog.read'], 'fixture-acquisition-token': ['catalog.read', 'publication.acquire'] });
const localAuth = profile === 'local'
  ? createLocalDevelopmentAuth({
      password: (await readFile(process.env.LOCAL_BROWSER_PASSWORD_FILE ?? '/run/secrets/local_browser_password', 'utf8')).trim(),
      signingSecret: (await readFile(process.env.LOCAL_BROWSER_SIGNING_SECRET_FILE ?? '/run/secrets/local_browser_signing_secret', 'utf8')).trim(),
      disclosePassword: () => {},
    })
  : undefined;
const localCredentialVerifier = profile === 'local'
  ? createLocalDevelopmentCredentialVerifier({ signingSecret: (await readFile(process.env.LOCAL_BROWSER_SIGNING_SECRET_FILE ?? '/run/secrets/local_browser_signing_secret', 'utf8')).trim() })
  : undefined;
const localPorts = localAuth ? {
  credentialSource: { async authenticate(authorization) { const subject = await localCredentialVerifier.authenticate(authorization); return subject ? { subject } : undefined; } },
  authorizer: { async authorize(principal, permission) { return localAuth.authorize(principal.subject, permission); } },
  audit: (record) => console.log(JSON.stringify({ correlationId: record.correlationId, category: record.category, outcome: record.outcome })),
} : undefined;
const delivery = profile === 'test'
  ? createFixtureDeliveryBoundary({ authorizer: fixtureAuthorizer, audit, publicOrigin: process.env.MASTER_LIBRARY_PUBLIC_ORIGIN, trustedProxyAddresses: (process.env.MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES ?? '127.0.0.1,::1').split(',').map((value) => value.trim()).filter(Boolean) })
  : deliveryBoundaryFromEnvironment(process.env, localPorts ?? { authorizer: fixtureAuthorizer, credentialSource: { async authenticate() { return undefined; } }, audit: (record) => console.log(JSON.stringify({ correlationId: record.correlationId, category: record.category, outcome: record.outcome })) });
const operationsRoot = process.env.OPERATIONS_ROOT ?? '/var/lib/knowledgeos/operations';
const ingestEnabled = process.env.MASTER_LIBRARY_INGEST_ENABLED === 'true';
const ingestLimit = Number(process.env.MASTER_LIBRARY_INGEST_MAX_BYTES ?? '524288000');
const inspectionLimit = Number(process.env.MASTER_LIBRARY_INSPECTION_MAX_BYTES ?? '16777216');
if (ingestEnabled && (profile !== 'local' || !Number.isSafeInteger(ingestLimit) || ingestLimit < 1 || !Number.isSafeInteger(inspectionLimit) || inspectionLimit < 1)) throw new Error('Local ingest requires valid positive ingest and inspection byte limits and a local delivery profile.');
const readiness = { async ready() { try { await Promise.all(['migration-ready', 'reconciliation-ready'].map((name) => access(join(operationsRoot, name)))); return true; } catch { return false; } } };
const ingest = ingestEnabled ? new AuthoritativeIngestService(new PostgresAuthoritativeIngestRepository(client), process.env.MASTER_LIBRARY_FILES_ROOT ?? '/var/lib/knowledgeos/master-library', { maxBytes: ingestLimit }) : undefined;
const interruptAfterPromotion = profile === 'local' && process.env.MASTER_LIBRARY_INGEST_INTERRUPT_AFTER_PROMOTED === 'true';
const ingestRoute = ingest ? {
  accept: ingest.accept.bind(ingest), status: ingest.status.bind(ingest),
  async acceptStream(request) { return ingest.acceptStream({ ...request, ...(interruptAfterPromotion ? { interruptAfter: 'promoted' } : {}) }); },
} : undefined;
const localOcrRequested = ingestEnabled && profile === 'local' && process.env.MASTER_LIBRARY_LOCAL_OCR_ENABLED !== 'false';
const localOcr = localOcrRequested && await verifyLocalOcrRuntime()
  ? new TesseractPdfOcrProvider()
  : undefined;
if (localOcrRequested && !localOcr) console.log(JSON.stringify({ category: 'local-ocr', outcome: 'unavailable' }));
const inspection = ingestEnabled ? {
  async inspect(request) {
    return inspectPublication({ metadata: request.metadata, source: request.source, ...(localOcr ? { ocr: localOcr } : {}) });
  },
} : undefined;
const server = new MasterDirectStreamingServer({ reader, catalog: new PostgresMasterCatalogReader(client), acquisitionReceipts: new PostgresAcquisitionReceiptRepository(client), ...(ingestRoute ? { ingest: ingestRoute } : {}), ...(inspection ? { inspection, inspectionMaximumBytes: inspectionLimit } : {}), delivery, processingRecovery: { async recover() { await ingest?.reconcile(); } }, readiness }, { host: process.env.HOST ?? '0.0.0.0', port: Number(process.env.PORT ?? 8081) });
await server.start();
const browser = profile === 'local' && process.env.LOCAL_BROWSER_EMBEDDED === 'true' ? new LocalMasterLibraryBrowserServer({
  auth: localAuth,
  expectedOrigin: process.env.LOCAL_BROWSER_ORIGIN ?? process.env.MASTER_LIBRARY_PUBLIC_ORIGIN,
  async fetcher(path, init) {
    const response = await fetch(`${process.env.MASTER_LIBRARY_V1_ORIGIN ?? process.env.MASTER_LIBRARY_PUBLIC_ORIGIN}${path}`, { method: init.method, headers: { authorization: init.authorization, ...(init.idempotencyKey ? { 'idempotency-key': init.idempotencyKey } : {}), ...(init.contentType ? { 'content-type': init.contentType } : init.body ? { 'content-type': 'application/json' } : {}), ...(init.contentLength ? { 'content-length': init.contentLength } : {}) }, body: typeof init.body === 'string' ? init.body : init.body ? Readable.toWeb(init.body) : undefined, ...(init.body && typeof init.body !== 'string' ? { duplex: 'half' } : {}) });
    return { status: response.status, body: await response.json() };
  },
}, { host: '0.0.0.0', port: Number(process.env.LOCAL_BROWSER_PORT ?? 8090) }) : undefined;
if (browser) await browser.start();
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await browser?.stop(); await server.stop(); await client.close(); process.exit(0); });
