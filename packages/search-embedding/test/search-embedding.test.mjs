import assert from "node:assert/strict";
import {
  DeterministicLocalEmbeddingProvider,
  cosineSimilarity,
} from "../dist/index.js";

const provider =
  new DeterministicLocalEmbeddingProvider(
    64,
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

const [heart, cardiac, unrelated] =
  await provider.embed([
    {
      searchDocumentId: "heart",
      text:
        "heart attack myocardial infarction",
      contentFingerprint:
        "sha256:heart",
    },
    {
      searchDocumentId: "cardiac",
      text:
        "myocardial infarction heart attack",
      contentFingerprint:
        "sha256:cardiac",
    },
    {
      searchDocumentId: "unrelated",
      text:
        "marine aquarium coral reef",
      contentFingerprint:
        "sha256:unrelated",
    },
  ]);

assert.equal(
  heart.vector.length,
  64,
);

assert.equal(
  cosineSimilarity(
    heart.vector,
    cardiac.vector,
  ) >
  cosineSimilarity(
    heart.vector,
    unrelated.vector,
  ),
  true,
);

console.log(JSON.stringify({
  flow:
    "local-embedding-cosine-similarity",
  status:
    "passed",
}));
