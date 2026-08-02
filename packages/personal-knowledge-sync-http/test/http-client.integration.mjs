import assert from "node:assert/strict";
import {
  createServer,
} from "node:http";
import {
  PersonalKnowledgeSyncHttpClient,
} from "../dist/index.js";

let stored;

const server = createServer(
  async (request, response) => {
    if (
      request.headers.authorization !==
      "Bearer test-token"
    ) {
      response.statusCode = 401;
      response.end();
      return;
    }

    if (
      request.method === "POST"
    ) {
      const chunks = [];
      for await (const chunk of request) {
        chunks.push(chunk);
      }

      stored =
        JSON.parse(
          Buffer.concat(chunks)
            .toString("utf8"),
        );

      response.statusCode = 200;
      response.setHeader(
        "content-type",
        "application/json",
      );
      response.end(
        JSON.stringify({
          acceptedRecords:
            stored.records.length,
        }),
      );
      return;
    }

    response.statusCode = 200;
    response.setHeader(
      "content-type",
      "application/json",
    );
    response.end(
      JSON.stringify(stored),
    );
  },
);

await new Promise(
  (resolve) =>
    server.listen(
      0,
      "127.0.0.1",
      resolve,
    ),
);

const address =
  server.address();

try {
  const client =
    new PersonalKnowledgeSyncHttpClient({
      baseUrl:
        `http://127.0.0.1:${address.port}`,
      authorizationHeader:
        "Bearer test-token",
    });

  const envelope = {
    ownerId: "user:1",
    sourceDeviceId:
      "device:mac",
    generatedAt:
      "2026-08-01T00:00:00.000Z",
    records: [],
  };

  const pushed =
    await client.push(envelope);

  assert.equal(
    pushed.acceptedRecords,
    0,
  );

  const pulled =
    await client.pull(
      "user:1",
      "device:iphone",
    );

  assert.equal(
    pulled.ownerId,
    "user:1",
  );

  console.log(JSON.stringify({
    flow:
      "personal-knowledge-http-push-pull-auth",
    status:
      "passed",
  }));
} finally {
  await new Promise(
    (resolve, reject) =>
      server.close(
        (error) =>
          error
            ? reject(error)
            : resolve(),
      ),
  );
}
