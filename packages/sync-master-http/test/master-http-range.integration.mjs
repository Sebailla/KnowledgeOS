import assert from "node:assert/strict";
import {
  createServer,
} from "node:http";
import {
  MasterHttpRangeClient,
} from "../dist/index.js";

const bytes = Buffer.from(
  "master-http-range-content",
);
const fingerprint =
  "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const server = createServer(
  (request, response) => {
    response.setHeader(
      "content-type",
      "application/pdf",
    );
    response.setHeader(
      "etag",
      `"${fingerprint}"`,
    );
    response.setHeader(
      "accept-ranges",
      "bytes",
    );

    if (
      request.method === "HEAD"
    ) {
      response.statusCode = 200;
      response.setHeader(
        "content-length",
        bytes.byteLength,
      );
      response.end();
      return;
    }

    const range =
      request.headers.range;

    if (
      typeof range === "string"
    ) {
      const match =
        /^bytes=(\d+)-(\d+)$/.exec(
          range,
        );
      const start =
        Number(match[1]);
      const end =
        Number(match[2]);
      const body =
        bytes.subarray(
          start,
          end + 1,
        );

      response.statusCode = 206;
      response.setHeader(
        "content-range",
        `bytes ${start}-${end}/${bytes.byteLength}`,
      );
      response.setHeader(
        "content-length",
        body.byteLength,
      );
      response.end(body);
      return;
    }

    response.statusCode = 400;
    response.end();
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
    new MasterHttpRangeClient({
      baseUrl:
        `http://127.0.0.1:${address.port}`,
    });

  const descriptor =
    await client.describe(
      "publication:http-1",
      "version:http-1",
    );

  assert.equal(
    descriptor.byteLength,
    bytes.byteLength,
  );
  assert.equal(
    descriptor.contentFingerprint,
    fingerprint,
  );

  const range =
    await client.readRange(
      "publication:http-1",
      "version:http-1",
      7,
      10,
    );

  assert.equal(
    Buffer.from(range).toString("utf8"),
    "http",
  );

  console.log(JSON.stringify({
    flow:
      "master-http-head-range-validation",
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
