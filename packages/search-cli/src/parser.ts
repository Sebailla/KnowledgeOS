import type {
  UnifiedSearchRequest,
} from "@knowledgeos/search-api";

export interface SearchCliCommand {
  readonly request:
    UnifiedSearchRequest;
  readonly format:
    | "table"
    | "json"
    | "ndjson";
}

export function parseSearchCliArguments(
  args: readonly string[],
): SearchCliCommand {
  const values =
    [...args];

  const queryParts:
    string[] = [];
  let mode:
    UnifiedSearchRequest["mode"] =
    "hybrid";
  let rankingProfile:
    UnifiedSearchRequest["rankingProfile"] =
    "balanced";
  let limit = 20;
  let offset = 0;
  let format:
    SearchCliCommand["format"] =
    "table";
  let includeFacets = false;
  let includeExplanation = false;

  for (
    let index = 0;
    index < values.length;
    index += 1
  ) {
    const value =
      values[index];

    if (value === "--mode") {
      mode =
        values[++index] as
          UnifiedSearchRequest["mode"];
      continue;
    }

    if (value === "--profile") {
      rankingProfile =
        values[++index] as
          UnifiedSearchRequest["rankingProfile"];
      continue;
    }

    if (value === "--limit") {
      limit =
        Number(values[++index]);
      continue;
    }

    if (value === "--offset") {
      offset =
        Number(values[++index]);
      continue;
    }

    if (value === "--format") {
      format =
        values[++index] as
          SearchCliCommand["format"];
      continue;
    }

    if (value === "--facets") {
      includeFacets = true;
      continue;
    }

    if (value === "--explain") {
      includeExplanation = true;
      continue;
    }

    if (
      value?.startsWith("--")
    ) {
      throw new Error(
        `Unknown search option: ${value}`,
      );
    }

    if (value) {
      queryParts.push(value);
    }
  }

  const query =
    queryParts.join(" ").trim();

  if (!query) {
    throw new Error(
      "Search query is required",
    );
  }

  return {
    request: {
      query,
      mode,
      rankingProfile,
      limit,
      offset,
      includeFacets,
      includeExplanation,
    },
    format,
  };
}
