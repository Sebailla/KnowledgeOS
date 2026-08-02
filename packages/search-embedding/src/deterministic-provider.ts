import type {
  SearchEmbedding,
  SearchEmbeddingProvider,
  SearchEmbeddingRequest,
} from "./model.js";
import {
  normalizeVector,
} from "./math.js";

function hashToken(
  token: string,
): number {
  let hash = 2166136261;

  for (const character of token) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(
      hash,
      16777619,
    );
  }

  return hash >>> 0;
}

export class DeterministicLocalEmbeddingProvider
implements SearchEmbeddingProvider {
  public readonly modelId =
    "deterministic-local-v1";

  public constructor(
    public readonly dimensions:
      number = 128,
    private readonly clock:
      { nowIso(): string } = {
        nowIso() {
          return new Date().toISOString();
        },
      },
  ) {
    if (
      !Number.isInteger(dimensions) ||
      dimensions < 8
    ) {
      throw new Error(
        "Embedding dimensions must be at least 8",
      );
    }
  }

  async embed(
    requests:
      readonly SearchEmbeddingRequest[],
  ): Promise<
    readonly SearchEmbedding[]
  > {
    return requests.map(
      (request) => {
        const vector =
          Array.from(
            {
              length:
                this.dimensions,
            },
            () => 0,
          );

        const tokens =
          request.text
            .normalize("NFKC")
            .toLowerCase()
            .split(/[^\p{L}\p{N}]+/u)
            .filter(Boolean);

        for (const token of tokens) {
          const hash =
            hashToken(token);
          const index =
            hash %
            this.dimensions;
          const sign =
            (hash & 1) === 0
              ? 1
              : -1;

          vector[index] =
            (vector[index] ?? 0) +
            sign;
        }

        return {
          searchDocumentId:
            request.searchDocumentId,
          modelId:
            this.modelId,
          dimensions:
            this.dimensions,
          vector:
            normalizeVector(
              vector,
            ),
          contentFingerprint:
            request.contentFingerprint,
          createdAt:
            this.clock.nowIso(),
        };
      },
    );
  }
}
