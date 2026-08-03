import type { SearchCacheKey } from "./model.js";

export function serializeSearchCacheKey(
  input: SearchCacheKey,
): string {
  return JSON.stringify({
    ownerId: input.ownerId,
    query: input.query.normalize("NFKC").trim(),
    mode: input.mode,
    profile: input.profile,
    limit: input.limit,
    offset: input.offset,
  });
}
