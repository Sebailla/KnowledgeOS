import { createServer } from 'node:http';
import { stat, createReadStream, mkdir, access } from 'node:fs';
import { resolve, normalize } from 'node:path';

const root = resolve(process.env.MASTER_LIBRARY_FILES_ROOT ?? '/var/lib/knowledgeos/master-library');
const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 8081);
const operationsRoot = resolve(process.env.OPERATIONS_ROOT ?? '/var/lib/knowledgeos/operations');
await new Promise((ok, fail) => mkdir(root, { recursive: true }, e => e ? fail(e) : ok()));

const server = createServer((request, response) => {
  const target = request.url ?? '/';
  if (request.method === 'GET' && target === '/health/ready') {
    Promise.all([resolve(operationsRoot, 'migration-ready'), resolve(operationsRoot, 'reconciliation-ready')].map(path => new Promise(resolve => access(path, error => resolve(error))))).then(errors => { const error = errors.find(Boolean);
      response.statusCode = error ? 503 : 200;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ state: error ? 'blocked' : 'ready' }));
    });
    return;
  }
  if (request.method === 'GET' && target === '/health/live') {
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify({ state: 'healthy' }));
    return;
  }
  const match = /^\/v1\/master-library\/files\/(.+)$/.exec(target);
  if (!match || !['GET', 'HEAD'].includes(request.method ?? '')) {
    response.statusCode = 404; response.end(); return;
  }
  const relative = normalize(decodeURIComponent(match[1])).replace(/^\.\.(\/|\\|$)+/, '');
  const file = resolve(root, relative);
  if (!file.startsWith(root + '/')) { response.statusCode = 400; response.end(); return; }
  stat(file, (error, info) => {
    if (error || !info.isFile()) { response.statusCode = 404; response.end(); return; }
    response.setHeader('content-length', info.size);
    response.setHeader('accept-ranges', 'bytes');
    if (request.method === 'HEAD') { response.end(); return; }
    createReadStream(file).pipe(response);
  });
});
server.listen(port, host);
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => process.exit(0)));
