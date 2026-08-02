import assert from "node:assert/strict";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  FilesystemResumableLocalStaging,
} from "../dist/index.js";

const root = await mkdtemp(
  join(tmpdir(), "knowledgeos-sync-staging-"),
);

try {
  const staging =
    new FilesystemResumableLocalStaging(
      root,
    );

  await staging.ensure(
    "transfer:staging-1",
  );

  await staging.append(
    "transfer:staging-1",
    0,
    Buffer.from("hello "),
  );

  await staging.append(
    "transfer:staging-1",
    6,
    Buffer.from("world"),
  );

  const recovered =
    await new FilesystemResumableLocalStaging(
      root,
    ).recover();

  assert.equal(
    recovered.length,
    1,
  );
  assert.equal(
    recovered[0].byteLength,
    11,
  );

  const bytes =
    await staging.readAll(
      "transfer:staging-1",
    );

  assert.equal(
    Buffer.from(bytes).toString("utf8"),
    "hello world",
  );

  await staging.discard(
    "transfer:staging-1",
  );

  console.log(JSON.stringify({
    flow:
      "filesystem-staging-append-fsync-recover",
    status:
      "passed",
  }));
} finally {
  await rm(root, {
    recursive: true,
    force: true,
  });
}
