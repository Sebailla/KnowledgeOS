import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { createLocalDevelopmentAuth, validateLocalDevelopmentAuthEnvironment } from '/app/workspace/packages/master-library-local-development-auth/dist/index.js';
import { LocalMasterLibraryBrowserServer } from '/app/workspace/apps/master-library-local-browser/dist/index.js';

if (process.env.MASTER_LIBRARY_DELIVERY_PROFILE !== 'local') throw new Error('The local browser runtime requires MASTER_LIBRARY_DELIVERY_PROFILE=local.');
validateLocalDevelopmentAuthEnvironment(process.env);
const password = (await readFile(process.env.LOCAL_BROWSER_PASSWORD_FILE ?? '/run/secrets/local_browser_password', 'utf8')).trim();
const signingSecret = (await readFile(process.env.LOCAL_BROWSER_SIGNING_SECRET_FILE ?? '/run/secrets/local_browser_signing_secret', 'utf8')).trim();
const auth = createLocalDevelopmentAuth({ password, signingSecret, disclosePassword: () => {}, sessionTtlMs: Number(process.env.LOCAL_BROWSER_SESSION_TTL_MS ?? 15 * 60 * 1000) });
const browser = new LocalMasterLibraryBrowserServer({
  auth,
  expectedOrigin: process.env.LOCAL_BROWSER_ORIGIN ?? 'https://localhost:8443',
  async fetcher(path, init) {
    const response = await fetch(`${process.env.MASTER_LIBRARY_V1_ORIGIN ?? 'http://master-library:8081'}${path}`, {
      method: init.method,
      headers: { authorization: init.authorization, 'x-forwarded-proto': 'https', 'x-forwarded-host': new URL(process.env.LOCAL_BROWSER_ORIGIN ?? 'https://localhost:8443').host, ...(init.idempotencyKey ? { 'idempotency-key': init.idempotencyKey } : {}), ...(init.contentType ? { 'content-type': init.contentType } : init.body ? { 'content-type': 'application/json' } : {}), ...(init.contentLength ? { 'content-length': init.contentLength } : {}) },
      body: typeof init.body === 'string' ? init.body : init.body ? Readable.toWeb(init.body) : undefined,
      ...(init.body && typeof init.body !== 'string' ? { duplex: 'half' } : {}),
    });
    const headers = Object.fromEntries(['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag'].flatMap((name) => response.headers.get(name) ? [[name, response.headers.get(name)]] : []));
    const body = response.ok && !String(response.headers.get('content-type')).includes('json') ? new Uint8Array(await response.arrayBuffer()) : await response.json().catch(() => ({}));
    return { status: response.status, body, headers };
  },
}, { host: '0.0.0.0', port: Number(process.env.LOCAL_BROWSER_PORT ?? 8090) });
await browser.start();
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await browser.stop(); process.exit(0); });
