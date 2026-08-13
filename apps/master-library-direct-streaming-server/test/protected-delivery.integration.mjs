import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { request as createProxyRequest } from "node:http";
import { createServer as createHttpsServer, request as httpsRequest } from "node:https";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  InMemoryMasterStorageCatalog,
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import {
  DirectMasterStorageReader,
} from "@knowledgeos/master-storage-node-stream";
import {
  FixtureDeliveryAuthorizer,
  MasterDirectStreamingServer,
  createFixtureDeliveryBoundary,
  deliveryBoundaryFromEnvironment,
  validateDeliveryConfiguration,
} from "../dist/index.js";

const root = await mkdtemp(join(tmpdir(), "knowledgeos-protected-delivery-"));

function requestOverTls(options) {
  return new Promise((resolve, reject) => {
    const request = httpsRequest({
      rejectUnauthorized: false,
      ...options,
    }, async (response) => {
      const chunks = [];
      for await (const chunk of response) chunks.push(chunk);
      resolve({
        status: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(chunks),
      });
    });
    request.once("error", reject);
    request.end();
  });
}

try {
  assert.throws(
    () => validateDeliveryConfiguration({ profile: "deployment" }),
    /publicOrigin/,
  );
  assert.throws(
    () => deliveryBoundaryFromEnvironment({
      MASTER_LIBRARY_DELIVERY_PROFILE: "deployment",
      MASTER_LIBRARY_PUBLIC_ORIGIN: "https://master-library.example",
      MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES: "127.0.0.1",
      MASTER_LIBRARY_TLS_MATERIAL_REF: "fixture://generated-tls",
      MASTER_LIBRARY_CREDENTIAL_SOURCE_REF: "fixture://test-credentials",
      MASTER_LIBRARY_AUTHORIZATION_PORT_REF: "fixture://delivery-authorizer",
    }, { credentialSource: { async authenticate() { return undefined; } }, authorizer: { async authorize() { return false; } }, audit() {} }),
    /rejects fixture ports/,
  );
  assert.throws(
    () => deliveryBoundaryFromEnvironment({}, {
      credentialSource: { async authenticate() { return undefined; } },
      authorizer: { async authorize() { return false; } },
      audit() {},
    }),
    /publicOrigin/,
  );

  const catalog = new InMemoryMasterStorageCatalog();
  const storage = new MasterPublicationStorage(root, catalog);
  const bytes = Buffer.concat([
    Buffer.from("protected delivery payload for range and cancellation"),
    Buffer.alloc(64 * 1024 * 1024, "x"),
  ]);
  const stored = await storage.commit({
    publicationId: "publication:protected-delivery-0001",
    versionId: "version:protected-delivery-0001",
    sourceItemId: "source-item:protected-delivery-0001",
    staged: await storage.stage(bytes, "application/pdf"),
  });
  const audit = [];
  const authorizer = new FixtureDeliveryAuthorizer({
    "fixture-acquisition-token": ["catalog.read", "publication.acquire"],
    "fixture-catalog-token": ["catalog.read"],
  });
  const directReader = new DirectMasterStorageReader(root, catalog);
  const server = new MasterDirectStreamingServer({
    reader: {
      describe: directReader.describe.bind(directReader),
      async open(...parameters) {
        const opened = await directReader.open(...parameters);
        return {
          ...opened,
          stream: (async function* () {
            for await (const chunk of opened.stream) {
              yield chunk;
              await new Promise((resolve) => setTimeout(resolve, 2));
            }
          })(),
        };
      },
    },
    catalog: {
      async browse() { return { protocolVersion: "v1", items: [] }; },
      async manifest(publicationId, versionId) {
        assert.equal(publicationId, stored.publicationId);
        assert.equal(versionId, stored.versionId);
        return {
          protocolVersion: "v1",
          publicationId: stored.publicationId,
          knowledgeObjectId: "knowledge-object:protected-delivery-0001",
          versionId: stored.versionId,
          contentFingerprint: stored.contentFingerprint,
          byteLength: stored.byteLength,
          mediaType: stored.mediaType,
        };
      },
    },
    delivery: createFixtureDeliveryBoundary({ authorizer, audit }),
  }, { host: "127.0.0.1", port: 0 });

  const address = await server.start();
  const contentPath = "/v1/master-library/publications/" +
    encodeURIComponent(stored.publicationId) + "/versions/" +
    encodeURIComponent(stored.versionId) + "/content";

  const direct = await fetch(`http://${address.host}:${address.port}${contentPath}`, {
    headers: { authorization: "Bearer fixture-acquisition-token" },
  });
  assert.equal(direct.status, 403);
  assert.equal((await direct.json()).error.code, "authorization.denied");

  const certificateDirectory = join(root, "certificate");
  await (await import("node:fs/promises")).mkdir(certificateDirectory);
  const certificatePath = join(certificateDirectory, "cert.pem");
  const keyPath = join(certificateDirectory, "key.pem");
  const generated = spawnSync("openssl", [
    "req", "-x509", "-newkey", "rsa:2048", "-nodes",
    "-keyout", keyPath, "-out", certificatePath,
    "-subj", "/CN=master-library.test", "-days", "1",
  ], { stdio: "ignore" });
  assert.equal(generated.status, 0, "openssl must generate local fixture TLS");

  const proxy = createHttpsServer({
    key: await readFile(keyPath),
    cert: await readFile(certificatePath),
  }, (request, response) => {
    const upstream = createProxyRequest({
      host: address.host,
      port: address.port,
      path: request.url,
      method: request.method,
      headers: {
        ...request.headers,
        "x-forwarded-proto": "https",
        "x-forwarded-host": "master-library.test",
      },
    }, (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode ?? 500, upstreamResponse.headers);
      response.once("close", () => upstreamResponse.destroy());
      upstreamResponse.pipe(response);
    });
    upstream.once("error", () => response.destroy());
    request.pipe(upstream);
  });
  await new Promise((resolve) => proxy.listen(0, "127.0.0.1", resolve));
  const proxyAddress = proxy.address();
  assert.notEqual(typeof proxyAddress, "string");

  try {
    const unauthorized = await requestOverTls({
      host: "127.0.0.1", port: proxyAddress.port, path: contentPath,
      headers: { authorization: "Bearer fixture-catalog-token" },
    });
    assert.equal(unauthorized.status, 403);
    assert.equal(JSON.parse(unauthorized.body).error.code, "authorization.denied");

    const range = await requestOverTls({
      host: "127.0.0.1", port: proxyAddress.port, path: contentPath,
      headers: {
        authorization: "Bearer fixture-acquisition-token",
        range: "bytes=10-17",
      },
    });
    assert.equal(range.status, 206);
    assert.equal(range.body.toString("utf8"), "delivery");
    assert.equal(range.headers.etag, `"${stored.contentFingerprint}"`);
    assert.equal(range.headers["x-content-fingerprint"], stored.contentFingerprint);

    const invalidRange = await requestOverTls({
      host: "127.0.0.1", port: proxyAddress.port, path: contentPath,
      headers: { authorization: "Bearer fixture-acquisition-token", range: "bytes=99999999-100000000" },
    });
    assert.equal(invalidRange.status, 416);

    await new Promise((resolve, reject) => {
      const cancelled = createProxyRequest({
        host: address.host, port: address.port, path: contentPath,
        headers: {
          authorization: "Bearer fixture-acquisition-token",
          "x-forwarded-proto": "https",
          "x-forwarded-host": "master-library.test",
        },
      }, (response) => {
        response.once("data", () => cancelled.destroy());
        response.once("close", resolve);
      });
      cancelled.once("error", (error) => {
        if (error.code !== "ECONNRESET") reject(error);
      });
      cancelled.end();
    });
    for (let attempt = 0; attempt < 20 && !audit.some((entry) => entry.category === "delivery.cancelled"); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    assert.ok(audit.some((entry) => entry.category === "transport.untrusted"));
    assert.ok(audit.some((entry) => entry.category === "authorization.denied"));
    assert.ok(audit.some((entry) => entry.category === "range.invalid"));
    assert.ok(audit.some((entry) => entry.category === "delivery.cancelled"));
    assert.equal(JSON.stringify(audit).includes("fixture-acquisition-token"), false);
  } finally {
    await new Promise((resolve) => proxy.close(resolve));
    await server.stop();
  }
} finally {
  await rm(root, { recursive: true, force: true });
}
