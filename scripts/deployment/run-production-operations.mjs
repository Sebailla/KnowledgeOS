import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../..', import.meta.url).pathname;
const production = join(root, 'deployment/production');
const fixture = mkdtempSync(join(tmpdir(), 'knowledgeos-pr5-runtime-'));
const project = `knowledgeos-pr5-${process.pid}`;
const isolated = `${project}-restore`;
const env = {
  ...process.env,
  MASTER_LIBRARY_FIXTURE_ROOT: fixture,
  MASTER_LIBRARY_PUBLIC_ORIGIN: 'https://localhost:8443',
  MASTER_LIBRARY_HTTPS_PORT: '8443',
  MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES: '127.0.0.1',
  MASTER_LIBRARY_TLS_MATERIAL_REF: 'local-fixture',
  MASTER_LIBRARY_CREDENTIAL_SOURCE_REF: 'local-fixture',
  MASTER_LIBRARY_AUTHORIZATION_PORT_REF: 'local-fixture',
  MASTER_LIBRARY_TLS_CERTIFICATE_FILE: join(fixture, 'secrets/tls.crt'),
  MASTER_LIBRARY_TLS_PRIVATE_KEY_FILE: join(fixture, 'secrets/tls.key'),
  MASTER_LIBRARY_RECONCILIATION_FIXTURE: 'orphan',
};
const compose = (...args) => execFileSync('docker', ['compose', '-p', project, '-f', 'compose.yaml', '-f', 'compose.local.yaml', ...args], { cwd: production, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 });
const docker = (...args) => execFileSync('docker', args, { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 });
const wait = (check, message) => { for (let i = 0; i < 45; i += 1) { if (check()) return; spawnSync('sleep', ['1']); } throw new Error(message); };
try {
  execFileSync('bash', ['scripts/deployment/validate-production.sh', '--fixture-root', fixture], { cwd: root, env, encoding: 'utf8' });
  writeFileSync(join(fixture, 'publications', 'publication.txt'), 'authoritative fixture');
  compose('up', '-d', '--build', 'postgres', 'master-library-migrate', 'master-library-fixture-seed', 'master-library', 'master-library-proxy');
  wait(() => compose('ps', '--format', 'json').includes('healthy'), 'API did not become ready after migration.');
  assert.ok(existsSync(join(fixture, 'operations', 'migration-ready')), 'traffic readiness requires successful migration.');
  assert.equal(docker('exec', `${project}-postgres-1`, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', "SELECT count(*) FROM schema_migrations").trim(), '3');
  assert.equal(docker('exec', `${project}-postgres-1`, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', "SELECT count(*) FROM master_publications WHERE publication_id = 'publication:fixture-0001' AND knowledge_object_id IS NOT NULL").trim(), '1');
  const https = (...args) => execFileSync('curl', ['-ksS', ...args], { env, encoding: 'utf8' });
  const httpsConcurrent = (...args) => new Promise((resolve, reject) => {
    const child = spawn('curl', ['-ksS', ...args], { env }); let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; }); child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve(output) : reject(new Error(`curl exited ${code}`)));
  });
  const catalog = JSON.parse(https('-H', 'Authorization: Bearer fixture-catalog-token', 'https://localhost:8443/v1/master-library/catalog'));
  assert.equal(catalog.error, undefined, `catalog request failed: ${JSON.stringify(catalog)}`);
  assert.equal(catalog.items[0].title, 'Fixture publication');
  const contentUrl = 'https://localhost:8443/v1/master-library/publications/publication%3Afixture-0001/versions/version%3Afixture-0001/content';
  assert.equal(https('-D', '-', '-o', '/dev/null', '-H', 'Authorization: Bearer fixture-acquisition-token', '-H', 'Range: bytes=0-4', contentUrl).includes('206'), true);
  assert.equal(https('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-catalog-token', contentUrl), '403');
  assert.equal(https('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', 'https://localhost:8443/v1/master-library/files/publication.txt'), '404');
  await assert.rejects(() => fetch('http://127.0.0.1:8081/health/live'), /fetch failed/, 'application backend must not publish a host port');
  for (const marker of ['migration-ready', 'reconciliation-ready']) {
    // Manipulate inside the running container: Compose merges mounts by target,
    // so host fixture paths are not sufficient evidence of the effective mount.
    docker('exec', `${project}-master-library-1`, 'sh', '-c', `mv /var/lib/knowledgeos/operations/${marker} /var/lib/knowledgeos/operations/${marker}.blocked`);
    assert.equal(https('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-catalog-token', 'https://localhost:8443/v1/master-library/catalog'), '503', `${marker} absence blocks protected traffic`);
    docker('exec', `${project}-master-library-1`, 'sh', '-c', `mv /var/lib/knowledgeos/operations/${marker}.blocked /var/lib/knowledgeos/operations/${marker}`);
  }
  // Recreate while durable readiness is absent; concurrent protected requests must not leak bytes.
  const catalogRowsBeforeRecreate = docker('exec', `${project}-postgres-1`, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', 'SELECT count(*) FROM master_publications').trim();
  docker('exec', `${project}-master-library-1`, 'sh', '-c', 'mv /var/lib/knowledgeos/operations/reconciliation-ready /var/lib/knowledgeos/operations/reconciliation-ready.blocked');
  docker('restart', `${project}-master-library-1`);
  wait(() => { try { return https('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', contentUrl) === '503'; } catch { return false; } }, 'Recreated API did not block traffic while readiness was false.');
  const blockedConcurrent = await Promise.all([
    httpsConcurrent('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', '-H', 'Range: bytes=0-4', contentUrl),
    httpsConcurrent('-I', '-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', contentUrl),
  ]);
  assert.deepEqual(blockedConcurrent, ['503', '503']);
  docker('exec', `${project}-master-library-1`, 'sh', '-c', 'mv /var/lib/knowledgeos/operations/reconciliation-ready.blocked /var/lib/knowledgeos/operations/reconciliation-ready');
  wait(() => { try { return https('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', contentUrl) === '200'; } catch { return false; } }, 'Recreated API did not recover after readiness was restored.');
  assert.equal(https('-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', '-H', 'Range: bytes=0-4', contentUrl), '206');
  assert.equal(https('-I', '-o', '/dev/null', '-w', '%{http_code}', '-H', 'Authorization: Bearer fixture-acquisition-token', contentUrl), '200');
  assert.equal(docker('exec', `${project}-postgres-1`, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', 'SELECT count(*) FROM master_publications').trim(), catalogRowsBeforeRecreate, 'API recreation must not corrupt or duplicate catalog records');
  assert.equal(docker('exec', `${project}-postgres-1`, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', "SELECT state FROM master_operations WHERE operation_id = 'pr5-orphan'").trim(), 'reconciliation-required', 'reconciliation must persist the orphan finding before readiness.');

  // Upgrade preflight reruns the checksum-validated migrator before recreating API traffic.
  compose('up', '-d', '--force-recreate', 'master-library-migrate');
  wait(() => { try { return docker('inspect', '-f', '{{.State.Status}}:{{.State.ExitCode}}', `${project}-master-library-migrate-1`).trim() === 'exited:0'; } catch { return false; } }, 'Upgrade migration did not complete.');
  assert.equal(docker('exec', `${project}-postgres-1`, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', "SELECT count(*) FROM schema_migrations").trim(), '3');
  compose('up', '-d', '--force-recreate', 'master-library');
  wait(() => compose('ps', '--format', 'json').includes('healthy'), 'API did not recover after recreate.');
  assert.equal(readFileSync(join(fixture, 'publications', 'publication.txt'), 'utf8'), 'authoritative fixture');

  const backup = join(fixture, 'backups', 'logical');
  execFileSync('mkdir', ['-p', backup]);
  const dump = execFileSync('docker', ['exec', `${project}-postgres-1`, 'pg_dump', '-U', 'knowledgeos', '-d', 'knowledgeos', '-Fc'], { env, maxBuffer: 32 * 1024 * 1024 });
  writeFileSync(join(backup, 'postgres.dump'), dump);
  for (const component of ['publications', 'operations']) execFileSync('tar', ['-czf', join(backup, `${component}.tar.gz`), '-C', join(fixture, component), '.']);

  docker('run', '-d', '--name', isolated, '-e', 'POSTGRES_DB=knowledgeos', '-e', 'POSTGRES_USER=knowledgeos', '-e', 'POSTGRES_PASSWORD=local-fixture-password', 'postgres:17-alpine');
  wait(() => { try { return docker('exec', isolated, 'pg_isready', '-U', 'knowledgeos', '-d', 'knowledgeos').includes('accepting'); } catch { return false; } }, 'Isolated restore database did not start.');
  execFileSync('docker', ['exec', '-i', isolated, 'pg_restore', '-U', 'knowledgeos', '-d', 'knowledgeos'], { input: dump, env, maxBuffer: 32 * 1024 * 1024 });
  assert.equal(docker('exec', isolated, 'psql', '-U', 'knowledgeos', '-d', 'knowledgeos', '-tAc', "SELECT count(*) FROM schema_migrations").trim(), '2');

  writeFileSync(join(fixture, 'publications', 'publication.txt'), 'mutated');
  execFileSync('tar', ['-xzf', join(backup, 'publications.tar.gz'), '-C', join(fixture, 'publications')]);
  assert.equal(readFileSync(join(fixture, 'publications', 'publication.txt'), 'utf8'), 'authoritative fixture');
  console.log(JSON.stringify({ result: 'passed', fixture: 'redacted', nasReleaseReady: false, scenarios: ['migration-readiness', 'durable-reconciliation-before-readiness', 'protected-tls-catalog-range-authorization', 'legacy-file-route-denied', 'recreate-retention', 'upgrade-migration-idempotency', 'logical-backup-isolated-restore', 'rollback-file-retention'] }));
} finally {
  try { docker('rm', '-f', isolated); } catch {}
  try { compose('down', '--remove-orphans'); } catch {}
  rmSync(fixture, { recursive: true, force: true });
}
