import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request } from "node:https";

const root = new URL("../..", import.meta.url).pathname;
const fixture = mkdtempSync(join(tmpdir(), "knowledgeos-local-ingest-e2e-"));
const project = `knowledgeos-ingest-e2e-${process.pid}-${Date.now()}`;
const port = String(18_000 + Math.floor(Math.random() * 1_000));
const password = "local-ingest-e2e-password";
const persistentPasswordFile = join(fixture, "persistent-browser-password.txt");
writeFileSync(persistentPasswordFile, `${password}\n`, { mode: 0o600 });
const environment = {
  ...process.env,
  KNOWLEDGEOS_COMPOSE_PROJECT: project,
  MASTER_LIBRARY_FIXTURE_ROOT: fixture,
  MASTER_LIBRARY_HTTPS_PORT: port,
  MASTER_LIBRARY_LOCAL_BROWSER_PASSWORD_SOURCE_FILE: persistentPasswordFile,
  MASTER_LIBRARY_SESSION_TTL_MS: "900000",
  MASTER_LIBRARY_INGEST_MAX_BYTES: "256",
};
const composeEnvironment = {
  ...environment,
  MASTER_LIBRARY_PUBLIC_ORIGIN: `https://localhost:${port}`,
  MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES: "*",
  MASTER_LIBRARY_TLS_MATERIAL_REF: "fixture://generated-tls",
  MASTER_LIBRARY_CREDENTIAL_SOURCE_REF: "local://development-browser",
  MASTER_LIBRARY_AUTHORIZATION_PORT_REF: "local://development-browser",
  MASTER_LIBRARY_TLS_CERTIFICATE_FILE: join(fixture, "secrets", "tls.crt"),
  MASTER_LIBRARY_TLS_PRIVATE_KEY_FILE: join(fixture, "secrets", "tls.key"),
};
const compose = ["compose", "--project-name", project, "-f", "deployment/production/compose.yaml", "-f", "deployment/production/compose.local.yaml"];
const userPanelBefore = spawnSync("docker", ["inspect", "--format", "{{.State.Running}} {{if .State.Health}}{{.State.Health.Status}}{{end}}", "knowledgeos-master-library-1"], { encoding: "utf8" });
let cleaned = false;
const teardown = () => {
  if (cleaned) return;
  cleaned = true;
  try {
    execFileSync("docker", [...compose, "down", "--volumes", "--remove-orphans"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
    const remaining = execFileSync("docker", [...compose, "ps", "-q"], { cwd: root, env: composeEnvironment, encoding: "utf8" }).trim();
    assert.equal(remaining, "", `isolated project still has containers: ${remaining}`);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
};
const interrupted = (signal) => {
  console.error(JSON.stringify({ harness: "local-master-library-browser", project, status: "failed", stage: "signal", signal }));
  try { teardown(); } catch (error) { console.error(JSON.stringify({ harness: "local-master-library-browser", project, status: "teardown-failed", message: error instanceof Error ? error.message : String(error) })); }
  process.exit(signal === "SIGTERM" ? 143 : 130);
};
process.once("SIGINT", () => interrupted("SIGINT"));
process.once("SIGTERM", () => interrupted("SIGTERM"));
process.once("exit", teardown);
const call = (method, path, headers = {}, body) => new Promise((resolve, reject) => {
  const req = request({ host: "localhost", port: Number(port), method, path, headers, rejectUnauthorized: false }, response => {
    const chunks = [];
    response.on("data", chunk => chunks.push(chunk));
    response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
  });
  req.setTimeout(10_000, () => req.destroy(new Error(`request timeout: ${method} ${path}`)));
  req.once("error", reject);
  if (body) req.write(body);
  req.end();
});
const multipart = (metadata, bytes, filename) => {
  const boundary = `knowledgeos-ingest-${crypto.randomUUID()}`;
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="${filename}"\r\nContent-Type: ${metadata.declaredMediaType}\r\n\r\n`),
    bytes,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  return { body, contentType: `multipart/form-data; boundary=${boundary}` };
};
const login = async () => {
  const response = await call("POST", "/local/auth/login", { origin: `https://localhost:${port}`, "content-type": "application/json" }, Buffer.from(JSON.stringify({ email: "admin@knowledgeos.local", password })));
  assert.equal(response.status, 204, response.body.toString());
  return String(response.headers["set-cookie"]).split(";", 1)[0];
};
const upload = async (cookie, key, metadata, bytes, filename = metadata.originalFilename) => {
  const form = multipart(metadata, bytes, filename);
  return call("POST", "/local/api/publications:ingest", {
    cookie,
    origin: `https://localhost:${port}`,
    "content-type": form.contentType,
    "content-length": String(form.body.byteLength),
    "idempotency-key": key,
  }, form.body);
};
const inspect = async (cookie, metadata, bytes, filename = metadata.originalFilename) => {
  const form = multipart(metadata, bytes, filename);
  return call("POST", "/local/api/publications:inspect", {
    cookie,
    origin: `https://localhost:${port}`,
    "content-type": form.contentType,
    "content-length": String(form.body.byteLength),
  }, form.body);
};
const waitForReady = async () => {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    try { if ((await call("GET", "/health/ready")).status === 200) return; } catch { /* recreate window */ }
    await new Promise(resolve => setTimeout(resolve, 1_000));
  }
  throw new Error("local Docker composition never became ready");
};

let started = false;
let failure;
try {
  const start = spawnSync("node", ["scripts/deployment/start-local-master-library-browser.mjs"], { cwd: root, env: environment, encoding: "utf8", timeout: 240_000 });
  assert.equal(start.status, 0, `${start.stdout}\n${start.stderr}`);
  started = true;
  assert.match(start.stdout, /Persistent local login: admin@knowledgeos\.local/);
  assert.doesNotMatch(start.stdout, /local-ingest-e2e-password/);
  assert.equal(statSync(persistentPasswordFile).mode & 0o777, 0o600);
  assert.equal(statSync(join(fixture, "secrets", "local_browser_signing_secret.txt")).mode & 0o777, 0o600);

  const panel = await call("GET", "/");
  assert.equal(panel.status, 200);
  assert.match(panel.body.toString(), /Local Master Library/);
  assert.equal((await call("GET", "/local/api/catalog")).status, 401);
  const cookie = await login();
  const scannedBytes = readFileSync(join(root, "packages/import/test/fixtures/scanned-paper.pdf"));
  const scannedMetadata = { title: "Manual correction", authors: ["Manual author"], originalFilename: "scan.pdf", declaredMediaType: "application/pdf", byteLength: scannedBytes.byteLength };
  const scanned = await inspect(cookie, scannedMetadata, scannedBytes);
  assert.equal(scanned.status, 200, scanned.body.toString());
  const scannedInspection = JSON.parse(scanned.body);
  assert.equal(scannedInspection.authors?.[0]?.value, "Ada Lovelace");
  assert.equal(scannedInspection.authors?.[0]?.evidence, "local-ocr");
  assert.equal(scannedInspection.candidates.some(candidate => candidate.value === "Scanned Paper" && candidate.evidence === "local-ocr"), true);
  assert.equal(scannedInspection.outcome, "completed");
  const failedInspection = await inspect(cookie, { title: "Manual", authors: ["Ada"], originalFilename: "broken.pdf", declaredMediaType: "application/pdf", byteLength: 4 }, Buffer.from("nope"));
  assert.equal(failedInspection.status, 400);
  assert.equal(JSON.parse(failedInspection.body).error.code, "inspection.validation-failed");
  const invalid = await upload(cookie, "ingest-invalid", { title: "Invalid", authors: ["Ada"], originalFilename: "invalid.pdf", declaredMediaType: "application/pdf", byteLength: 5 }, Buffer.from("nope"));
  assert.equal(invalid.status, 400);
  assert.equal(JSON.parse(invalid.body).error.code, "ingest.validation-failed");
  const oversizeBytes = Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(300, 0x41)]);
  const oversize = await upload(cookie, "ingest-oversize", { title: "Oversize", authors: ["Ada"], originalFilename: "oversize.pdf", declaredMediaType: "application/pdf", byteLength: oversizeBytes.byteLength }, oversizeBytes);
  assert.equal(oversize.status, 413);
  assert.equal(JSON.parse(oversize.body).error.code, "ingest.capacity-exceeded");

  const pdfBytes = Buffer.from("%PDF-1.7\nlocal docker pdf");
  const pdfMetadata = { title: "Docker PDF", authors: ["Ada"], originalFilename: "docker.pdf", declaredMediaType: "application/pdf", byteLength: pdfBytes.byteLength };
  const pdf = await upload(cookie, "ingest-pdf", pdfMetadata, pdfBytes);
  assert.equal(pdf.status, 202, pdf.body.toString());
  const pdfAccepted = JSON.parse(pdf.body);
  assert.equal(pdfAccepted.outcome, "registered");
  const replay = await upload(cookie, "ingest-pdf", pdfMetadata, pdfBytes);
  assert.deepEqual(JSON.parse(replay.body), pdfAccepted);
  const duplicate = await upload(cookie, "ingest-pdf-duplicate", pdfMetadata, pdfBytes);
  assert.equal(duplicate.status, 202, duplicate.body.toString());
  assert.equal(JSON.parse(duplicate.body).outcome, "duplicate");

  const epubBytes = Buffer.from([0x50, 0x4b, 0x03, 0x04, ...Buffer.from("mimetypeapplication/epub+zip")]);
  const epubMetadata = { title: "Docker EPUB", authors: ["Ada"], originalFilename: "docker.epub", declaredMediaType: "application/epub+zip", byteLength: epubBytes.byteLength };
  const epub = await upload(cookie, "ingest-epub", epubMetadata, epubBytes);
  assert.equal(epub.status, 202, epub.body.toString());
  const epubAccepted = JSON.parse(epub.body);
  assert.equal(epubAccepted.outcome, "registered");

  const catalog = await call("GET", "/local/api/catalog", { cookie });
  assert.equal(catalog.status, 200, catalog.body.toString());
  const catalogItems = JSON.parse(catalog.body).items;
  const pdfItem = catalogItems.find(item => item.publicationId === pdfAccepted.publicationId);
  const epubItem = catalogItems.find(item => item.publicationId === epubAccepted.publicationId);
  assert.ok(pdfItem && epubItem, "both authoritative browser uploads must be catalog-visible");
  const download = await call("GET", `/local/api/publications/${encodeURIComponent(pdfAccepted.publicationId)}/versions/${encodeURIComponent(pdfAccepted.versionId)}/content`, { cookie });
  assert.equal(download.status, 200);
  assert.deepEqual(download.body, pdfBytes);

  // A test-only runtime seam stops after durable promotion. Reconciliation must
  // make the retained bytes browseable only after the one-shot runner restarts.
  const interruptedEnvironment = { ...composeEnvironment, MASTER_LIBRARY_INGEST_INTERRUPT_AFTER_PROMOTED: "true" };
  execFileSync("docker", [...compose, "up", "-d", "--force-recreate", "master-library"], { cwd: root, env: interruptedEnvironment, stdio: "inherit", timeout: 120_000 });
  await waitForReady();
  const interruptedBytes = Buffer.from("%PDF-1.7\ninterrupted promote");
  const interruptedMetadata = { title: "Recovered Docker PDF", authors: ["Ada"], originalFilename: "recovered.pdf", declaredMediaType: "application/pdf", byteLength: interruptedBytes.byteLength };
  const interrupted = await upload(cookie, "ingest-interrupted", interruptedMetadata, interruptedBytes);
  assert.equal(interrupted.status, 202, interrupted.body.toString());
  const interruptedAccepted = JSON.parse(interrupted.body);
  const hidden = await call("GET", "/local/api/catalog", { cookie });
  assert.equal(hidden.status, 200);
  assert.equal(JSON.parse(hidden.body).items.some(item => item.publicationId === interruptedAccepted.publicationId), false, "promoted-but-unregistered bytes must stay hidden");
  execFileSync("docker", [...compose, "run", "--rm", "master-library-migrate"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
  execFileSync("docker", [...compose, "up", "-d", "--force-recreate", "master-library"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
  await waitForReady();
  const recovered = await call("GET", `/local/api/ingest-operations/${encodeURIComponent(interruptedAccepted.operationId)}`, { cookie });
  assert.equal(recovered.status, 200, recovered.body.toString());
  assert.deepEqual(JSON.parse(recovered.body), { operationId: interruptedAccepted.operationId, state: "registered", outcome: "registered" });

  execFileSync("docker", [...compose, "restart", "master-library"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
  await waitForReady();
  const afterRestart = await call("GET", "/local/api/catalog", { cookie });
  assert.equal(afterRestart.status, 200, afterRestart.body.toString());
  assert.equal(JSON.parse(afterRestart.body).items.some(item => item.publicationId === epubAccepted.publicationId), true);
  const status = await call("GET", `/local/api/ingest-operations/${encodeURIComponent(epubAccepted.operationId)}`, { cookie });
  assert.equal(status.status, 200, status.body.toString());
  assert.deepEqual(JSON.parse(status.body), { operationId: epubAccepted.operationId, state: "registered", outcome: "registered" });

  const browserId = execFileSync("docker", [...compose, "ps", "-q", "master-library-browser"], { cwd: root, env: composeEnvironment, encoding: "utf8" }).trim();
  const browserMounts = JSON.parse(execFileSync("docker", ["inspect", browserId, "--format", "{{json .Mounts}}"], { encoding: "utf8" }));
  assert.equal(browserMounts.some(mount => /knowledgeos\/(master-library|operations)|postgresql|local-library/i.test(mount.Destination)), false);
  const browserNetworks = JSON.parse(execFileSync("docker", ["inspect", browserId, "--format", "{{json .NetworkSettings.Networks}}"], { encoding: "utf8" }));
  assert.equal(Object.keys(browserNetworks).length, 1, "browser must use only the isolated Compose backend network");
  const logs = execFileSync("docker", [...compose, "logs", "--no-color"], { cwd: root, env: composeEnvironment, encoding: "utf8" });
  assert.doesNotMatch(logs, /local-ingest-e2e-password|local_browser_signing_secret|BEGIN PRIVATE KEY/i);
} catch (error) {
  failure = error;
  process.exitCode = 1;
  console.error(JSON.stringify({ harness: "local-master-library-browser", project, status: "failed", stage: "runtime", message: error instanceof Error ? error.message : String(error) }));
} finally {
  try {
    teardown();
    if (started) {
      const userPanel = spawnSync("docker", ["inspect", "--format", "{{.State.Running}} {{if .State.Health}}{{.State.Health.Status}}{{end}}", "knowledgeos-master-library-1"], { encoding: "utf8" });
      if (userPanelBefore.status === 0) {
        assert.equal(userPanel.status, 0, "user panel disappeared during isolated harness execution");
        assert.equal(userPanel.stdout.trim(), userPanelBefore.stdout.trim(), `user panel changed state: ${userPanel.stdout.trim()}`);
      }
    }
    if (!failure) console.log(JSON.stringify({ harness: "local-master-library-browser", project, status: "passed", teardown: "passed", userPanel: started ? "healthy" : "not-started" }));
  } catch (error) {
    process.exitCode = 1;
    console.error(JSON.stringify({ harness: "local-master-library-browser", project, status: "teardown-failed", message: error instanceof Error ? error.message : String(error) }));
  }
}
