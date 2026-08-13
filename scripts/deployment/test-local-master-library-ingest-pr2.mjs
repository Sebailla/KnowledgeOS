import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request } from "node:https";

const root = new URL("../..", import.meta.url).pathname;
const fixture = mkdtempSync(join(tmpdir(), "knowledgeos-local-ingest-pr2-"));
const port = String(19_100 + Math.floor(Math.random() * 500));
const syncPort = String(20_100 + Math.floor(Math.random() * 500));
const project = `knowledgeos-ingest-test-${process.pid}`;
const resultPath = process.env.KNOWLEDGEOS_INGEST_HARNESS_RESULT;
const environment = { ...process.env, KNOWLEDGEOS_COMPOSE_PROJECT: project, MASTER_LIBRARY_FIXTURE_ROOT: fixture, MASTER_LIBRARY_HTTPS_PORT: port, SYNC_PORT: syncPort, LOCAL_BROWSER_PASSWORD: "local-ingest-e2e-password", MASTER_LIBRARY_INGEST_INTERRUPT_AFTER_PROMOTED: "true" };
const composeEnvironment = { ...environment, MASTER_LIBRARY_PUBLIC_ORIGIN: `https://localhost:${port}`, MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES: "*", MASTER_LIBRARY_TLS_MATERIAL_REF: "fixture://generated-tls", MASTER_LIBRARY_CREDENTIAL_SOURCE_REF: "local://development-browser", MASTER_LIBRARY_AUTHORIZATION_PORT_REF: "local://development-browser", MASTER_LIBRARY_TLS_CERTIFICATE_FILE: join(fixture, "secrets", "tls.crt"), MASTER_LIBRARY_TLS_PRIVATE_KEY_FILE: join(fixture, "secrets", "tls.key") };
const compose = ["compose", "--project-name", project, "-f", "deployment/production/compose.yaml", "-f", "deployment/production/compose.local.yaml"];

const call = (method, path, headers = {}, body) => new Promise((resolve, reject) => {
  const req = request({ host: "localhost", port: Number(port), method, path, headers, rejectUnauthorized: false }, response => {
    const chunks = [];
    response.on("data", chunk => chunks.push(chunk));
    response.on("end", () => resolve({ status: response.statusCode, body: Buffer.concat(chunks) }));
  });
  req.setTimeout(5_000, () => req.destroy(new Error(`request timeout: ${method} ${path}`)));
  req.once("error", reject);
  if (body) req.write(body);
  req.end();
});

const fail = (stage, error) => {
  const message = error instanceof Error ? error.message : String(error);
  const result = JSON.stringify({ harness: "local-master-library-ingest-pr2", project, status: "failed", stage, message });
  console.error(result);
  if (resultPath) appendFileSync(resultPath, `${result}\n`);
  process.exitCode = 1;
};

let stage = "start";
try {
  const started = spawnSync("node", ["scripts/deployment/start-local-master-library-browser.mjs"], { cwd: root, env: environment, encoding: "utf8", timeout: 240_000 });
  assert.equal(started.status, 0, `${started.stdout}\n${started.stderr}`);
  stage = "ingest";
  const signingSecret = readFileSync(join(fixture, "secrets", "local_browser_signing_secret.txt"), "utf8").trim();
  const sessionId = randomUUID(); const expiresAt = Date.now() + 60_000;
  const credential = `${sessionId}.${expiresAt}.${createHmac("sha256", signingSecret).update(`${sessionId}.${expiresAt}`).digest("base64url")}`;
  const bytes = Buffer.from("%PDF-1.7 local Docker interrupted promotion");
  const metadata = { title: "Docker Recovery Ingest", authors: ["Ada"], originalFilename: "docker-recovery.pdf", declaredMediaType: "application/pdf", byteLength: bytes.byteLength };
  const boundary = "knowledgeos-ingest-pr2";
  const body = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="docker-recovery.pdf"\r\nContent-Type: application/pdf\r\n\r\n`), bytes, Buffer.from(`\r\n--${boundary}--\r\n`)]);
  const headers = { authorization: `Bearer ${credential}`, "content-type": `multipart/form-data; boundary=${boundary}`, "idempotency-key": "docker-pr2-interrupted" };
  const accepted = await call("POST", "/v1/master-library/publications:ingest", headers, body);
  assert.equal(accepted.status, 202, accepted.body.toString());
  const operation = JSON.parse(accepted.body);
  const before = await call("GET", "/v1/master-library/catalog", { authorization: `Bearer ${credential}` });
  assert.equal(before.status, 200, before.body.toString());
  assert.equal(JSON.parse(before.body).items.some(item => item.publicationId === operation.publicationId), false);
  stage = "reconcile-and-recreate";
  execFileSync("docker", [...compose, "run", "--rm", "master-library-migrate"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
  writeFileSync(join(fixture, "secrets", "local_browser_password.txt"), "local-ingest-e2e-password\n", { mode: 0o600 });
  execFileSync("docker", [...compose, "up", "-d", "--force-recreate", "master-library"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
  stage = "recover-visible-catalog";
  let after;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      after = await call("GET", "/v1/master-library/catalog", { authorization: `Bearer ${credential}` });
      if (after.status === 200 && JSON.parse(after.body).items.some(item => item.publicationId === operation.publicationId)) break;
    } catch { /* the recreated API may still be starting */ }
    await new Promise(resolve => setTimeout(resolve, 1_000));
  }
  assert.equal(after?.status, 200, "catalog never became ready after restart");
  assert.equal(JSON.parse(after.body).items.some(item => item.publicationId === operation.publicationId), true, "promoted source was not catalog-visible after reconciliation");
  const result = JSON.stringify({ harness: "local-master-library-ingest-pr2", project, status: "passed", operationId: operation.operationId, recoveredCatalogVisible: true });
  console.log(result);
  if (resultPath) appendFileSync(resultPath, `${result}\n`);
} catch (error) {
  fail(stage, error);
} finally {
  stage = "isolated-teardown";
  try {
    execFileSync("docker", [...compose, "down", "--volumes", "--remove-orphans"], { cwd: root, env: composeEnvironment, stdio: "inherit", timeout: 120_000 });
    const remaining = execFileSync("docker", ["compose", "--project-name", project, "-f", "deployment/production/compose.yaml", "-f", "deployment/production/compose.local.yaml", "ps", "-q"], { cwd: root, env: composeEnvironment, encoding: "utf8" }).trim();
    assert.equal(remaining, "", `isolated project still has containers: ${remaining}`);
    const panel = execFileSync("docker", ["inspect", "--format", "{{.State.Running}} {{if .State.Health}}{{.State.Health.Status}}{{end}}", "knowledgeos-master-library-1"], { encoding: "utf8" }).trim();
    assert.equal(panel, "true healthy", `user panel changed state: ${panel}`);
    const result = JSON.stringify({ harness: "local-master-library-ingest-pr2", project, teardown: "passed", userPanel: panel, isolatedContainers: 0 });
    console.log(result);
    if (resultPath) appendFileSync(resultPath, `${result}\n`);
  } catch (error) {
    fail(stage, error);
  }
  rmSync(fixture, { recursive: true, force: true });
}
