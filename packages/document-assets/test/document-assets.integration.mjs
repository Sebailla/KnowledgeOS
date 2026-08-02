import assert from "node:assert/strict";
import { InMemoryDocumentAssetRepository } from "../dist/index.js";

const repository = new InMemoryDocumentAssetRepository();
const bytes = new Uint8Array([1, 2, 3]);

await repository.put({
  assetId: "asset:1",
  sourceId: "source:1",
  kind: "image",
  mimeType: "image/png",
  byteLength: 3,
  contentFingerprint: "sha256:test",
  metadata: {},
}, bytes);

assert.deepEqual(
  [...(await repository.get("asset:1")).bytes],
  [1, 2, 3],
);

console.log(JSON.stringify({
  flow: "document-asset-repository",
  status: "passed",
}));
