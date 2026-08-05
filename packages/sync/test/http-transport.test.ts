import assert from "node:assert/strict";
import test from "node:test";

import {
  MasterLibraryTransport,
} from "../src/index.js";

test("transport decodes health", async () => {
  const transport =
    new MasterLibraryTransport(
      {
        baseURL:
          "http://localhost:8080",
      },
      async () =>
        new Response(
          JSON.stringify({
            status: "ok",
            protocolVersion: "1.0",
            serverVersion: "1.0.0",
            authenticated: true,
          }),
          { status: 200 },
        ),
    );

  const health =
    await transport.health();

  assert.equal(
    health.protocolVersion,
    "1.0",
  );
  assert.equal(
    health.authenticated,
    true,
  );
});
