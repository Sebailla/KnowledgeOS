import assert from "node:assert/strict";
import test from "node:test";

import {
  MasterLibraryTransport,
} from "@knowledgeos/sync";
import {
  SyncHTTPServer,
} from "../src/index.js";

test("push and pull use real HTTP", async () => {
  const server =
    new SyncHTTPServer({
      host: "127.0.0.1",
      port: 0,
      token: "secret",
    });

  const address =
    await server.start();

  const client =
    new MasterLibraryTransport({
      baseURL:
        `http://${address.host}:${address.port}`,
      token: "secret",
      maxAttempts: 1,
    });

  const pushed =
    await client.push(
      [{ id: "operation:1" }],
      "request:1",
    );

  assert.equal(pushed.accepted, 1);

  const pulled =
    await client.pull("0");

  assert.equal(
    pulled.operations.length,
    1,
  );

  await server.stop();
});
