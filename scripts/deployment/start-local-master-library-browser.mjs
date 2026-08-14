import { execFileSync } from 'node:child_process';
import { chmodSync, lstatSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { request } from 'node:https';

const root = new URL('../..', import.meta.url).pathname;
const fixture = process.env.MASTER_LIBRARY_FIXTURE_ROOT || mkdtempSync(join(tmpdir(), 'knowledgeos-local-browser-'));
const port = process.env.MASTER_LIBRARY_HTTPS_PORT || '8443';
const persistentPasswordSource = process.env.MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE;
const sourcePassword = (path) => {
  if (!isAbsolute(path)) throw new Error('MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE must be an absolute path.');
  if (!relative(root, resolve(path)).startsWith('..')) throw new Error('MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE must not be inside the repository.');
  const metadata = lstatSync(path);
  if (!metadata.isFile()) throw new Error('MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE must be a regular file.');
  if ((metadata.mode & 0o777) !== 0o600) throw new Error('MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE must have mode 0600.');
  const password = readFileSync(path, 'utf8').trim();
  if (!password) throw new Error('MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE must not be empty.');
  return password;
};
const password = persistentPasswordSource ? sourcePassword(persistentPasswordSource) : `local-${crypto.randomUUID()}`;
const signingSecret = crypto.randomUUID();
const secret = (name, value) => { const path = join(fixture, 'secrets', name); writeFileSync(path, `${value}\n`, { mode: 0o600 }); chmodSync(path, 0o600); return path; };
for (const name of ['postgres', 'publications', 'operations', 'backups', 'secrets']) mkdirSync(join(fixture, name), { recursive: true });
writeFileSync(join(fixture, 'publications', 'publication.txt'), 'KnowledgeOS local Master Library fixture\n');
secret('postgres_password.txt', 'knowledgeos-local-postgres');
secret('sync_token.txt', 'knowledgeos-local-sync');
const passwordPath = persistentPasswordSource || secret('local_browser_password.txt', password);
secret('local_browser_signing_secret.txt', signingSecret);
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', join(fixture, 'secrets', 'tls.key'), '-out', join(fixture, 'secrets', 'tls.crt'), '-subj', '/CN=localhost', '-days', '1'], { stdio: 'ignore' });
chmodSync(join(fixture, 'secrets', 'tls.key'), 0o600); chmodSync(join(fixture, 'secrets', 'tls.crt'), 0o600);
const environment = { ...process.env, MASTER_LIBRARY_FIXTURE_ROOT: fixture, MASTER_LIBRARY_HTTPS_PORT: port, MASTER_LIBRARY_PUBLIC_ORIGIN: `https://localhost:${port}`, MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES: '*', MASTER_LIBRARY_CREDENTIAL_SOURCE_REF: 'local://development-browser', MASTER_LIBRARY_AUTHORIZATION_PORT_REF: 'local://development-browser', MASTER_LIBRARY_TLS_MATERIAL_REF: 'fixture://generated-tls', MASTER_LIBRARY_TLS_CERTIFICATE_FILE: join(fixture, 'secrets', 'tls.crt'), MASTER_LIBRARY_TLS_PRIVATE_KEY_FILE: join(fixture, 'secrets', 'tls.key'), MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE: passwordPath };
const projectArguments = process.env.KNOWLEDGEOS_COMPOSE_PROJECT ? ['--project-name', process.env.KNOWLEDGEOS_COMPOSE_PROJECT] : [];
// Start only the browser route and its declared dependency chain.  The local panel
// does not require sync-server, and omitting it prevents an isolated Docker Desktop
// proof from binding the user's shared sync port.
execFileSync('docker', ['compose', ...projectArguments, '-f', 'deployment/production/compose.yaml', '-f', 'deployment/production/compose.local.yaml', 'up', '--build', '-d', 'master-library-proxy', 'master-library-browser'], { cwd: root, env: environment, stdio: 'inherit' });
const ready = (path, expected) => new Promise((resolve, reject) => { const req = request({ host: 'localhost', port: Number(port), path, rejectUnauthorized: false }, response => { response.resume(); response.statusCode === expected ? resolve() : reject(new Error(`${path} returned ${response.statusCode}.`)); }); req.once('error', reject); req.end(); });
for (const [path, expected] of [['/health/ready', 200], ['/', 200]]) for (let attempt = 0; attempt < 60; attempt += 1) { try { await ready(path, expected); break; } catch (error) { if (attempt === 59) throw error; await new Promise(resolve => setTimeout(resolve, 1000)); } }
console.log(`Local Master Library: https://localhost:${port}/`);
if (persistentPasswordSource) console.log('Persistent local login: admin@knowledgeos.local');
else {
  rmSync(passwordPath, { force: true });
  console.log(`Temporary login: admin@knowledgeos.local / ${password}`);
}
console.log(`Fixture root: ${fixture}`);
