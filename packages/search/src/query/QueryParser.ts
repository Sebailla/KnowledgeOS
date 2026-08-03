import { SearchQueryError } from "../errors/SearchQueryError.js";
import type {
  SearchFilter,
  SearchQuery,
  SearchSort,
} from "../model/SearchQuery.js";

export interface ParseSearchQueryOptions {
  readonly offset?: number;
  readonly limit?: number;
  readonly sort?: readonly SearchSort[];
}

export class QueryParser {
  public parse(
    input: string,
    options: ParseSearchQueryOptions = {},
  ): SearchQuery {
    const trimmed = input.trim();
    const filters: SearchFilter[] = [];
    const textTerms: string[] = [];

    for (const token of this.tokenize(trimmed)) {
      const separator = token.indexOf(":");

      if (separator > 0) {
        const field = token.slice(0, separator);
        const rawValue = token.slice(separator + 1);

        if (rawValue.length === 0) {
          throw new SearchQueryError(
            `Filter '${field}' requires a value.`,
          );
        }

        if (field === "tag") {
          filters.push({
            kind: "tag",
            value: rawValue,
          });
        } else {
          filters.push({
            kind: "metadata",
            field,
            value: rawValue,
          });
        }

        continue;
      }

      textTerms.push(token);
    }

    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;

    if (!Number.isInteger(offset) || offset < 0) {
      throw new SearchQueryError(
        "Search offset must be a non-negative integer.",
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
      throw new SearchQueryError(
        "Search limit must be an integer between 1 and 500.",
      );
    }

    return {
      text: textTerms.join(" "),
      filters,
      sort: options.sort ?? [
        {
          field: "score",
          direction: "desc",
        },
      ],
      offset,
      limit,
    };
  }

  private tokenize(input: string): readonly string[] {
    if (input.length === 0) {
      return [];
    }

    const tokens =
      input.match(/"[^"]+"|\S+/g) ?? [];

    return tokens.map((token) =>
      token.startsWith('"') && token.endsWith('"')
        ? token.slice(1, -1)
        : token,
    );
  }
}
