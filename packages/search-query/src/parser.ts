import type {
  SearchField,
  SearchQuery,
  SearchQueryNode,
} from "./model.js";
import {
  tokenizeSearchQuery,
} from "./tokenizer.js";

const fields =
  new Set<SearchField>([
    "title",
    "body",
    "tag",
    "author",
    "language",
    "kind",
    "source",
    "created",
    "updated",
  ]);

class Parser {
  private index = 0;

  public constructor(
    private readonly tokens:
      ReturnType<typeof tokenizeSearchQuery>,
  ) {}

  parse(): SearchQueryNode | undefined {
    if (this.tokens.length === 0) {
      return undefined;
    }

    const root =
      this.parseOr();

    if (this.index !== this.tokens.length) {
      throw new Error(
        "Unexpected token in search query",
      );
    }

    return root;
  }

  private parseOr(): SearchQueryNode {
    const children = [
      this.parseAnd(),
    ];

    while (
      this.peek("operator", "OR")
    ) {
      this.index += 1;
      children.push(
        this.parseAnd(),
      );
    }

    return children.length === 1
      ? children[0]!
      : {
          type: "boolean",
          operator: "or",
          children,
        };
  }

  private parseAnd(): SearchQueryNode {
    const children = [
      this.parseUnary(),
    ];

    while (true) {
      if (
        this.peek("operator", "AND")
      ) {
        this.index += 1;
        children.push(
          this.parseUnary(),
        );
        continue;
      }

      const next =
        this.tokens[this.index];

      if (
        next &&
        next.kind !== "rparen" &&
        !(
          next.kind === "operator" &&
          next.value === "OR"
        )
      ) {
        children.push(
          this.parseUnary(),
        );
        continue;
      }

      break;
    }

    return children.length === 1
      ? children[0]!
      : {
          type: "boolean",
          operator: "and",
          children,
        };
  }

  private parseUnary(): SearchQueryNode {
    if (
      this.peek("operator", "NOT")
    ) {
      this.index += 1;
      return {
        type: "boolean",
        operator: "not",
        children: [
          this.parseUnary(),
        ],
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): SearchQueryNode {
    if (
      this.peek("lparen")
    ) {
      this.index += 1;
      const value =
        this.parseOr();

      if (!this.peek("rparen")) {
        throw new Error(
          "Missing closing parenthesis",
        );
      }

      this.index += 1;
      return value;
    }

    const first =
      this.tokens[this.index];

    if (!first) {
      throw new Error(
        "Unexpected end of search query",
      );
    }

    if (
      first.kind === "word" &&
      this.tokens[this.index + 1]?.kind ===
        "colon"
    ) {
      const field =
        first.value.toLowerCase() as SearchField;

      if (!fields.has(field)) {
        throw new Error(
          `Unsupported search field: ${first.value}`,
        );
      }

      this.index += 2;

      const value =
        this.tokens[this.index];

      if (!value) {
        throw new Error(
          "Missing field value",
        );
      }

      if (
        value.kind === "range"
      ) {
        if (
          field !== "created" &&
          field !== "updated"
        ) {
          throw new Error(
            "Ranges are supported only for created and updated",
          );
        }

        this.index += 1;
        const [fromRaw, toRaw] =
          value.value.split(/\s+TO\s+/i);

        return {
          type: "range",
          field,
          ...(fromRaw &&
          fromRaw !== "*"
            ? { from: fromRaw }
            : {}),
          ...(toRaw &&
          toRaw !== "*"
            ? { to: toRaw }
            : {}),
        };
      }

      if (
        value.kind !== "word" &&
        value.kind !== "phrase"
      ) {
        throw new Error(
          "Invalid field value",
        );
      }

      this.index += 1;
      return this.term(
        value.value,
        field,
        value.kind === "phrase",
      );
    }

    if (
      first.kind !== "word" &&
      first.kind !== "phrase"
    ) {
      throw new Error(
        "Expected search term",
      );
    }

    this.index += 1;
    return this.term(
      first.value,
      undefined,
      first.kind === "phrase",
    );
  }

  private term(
    raw: string,
    field:
      SearchField | undefined,
    phrase: boolean,
  ): SearchQueryNode {
    const prefix =
      !phrase &&
      raw.endsWith("*") &&
      raw.length > 1;

    return {
      type: "term",
      value:
        prefix
          ? raw.slice(0, -1)
          : raw,
      ...(field
        ? { field }
        : {}),
      phrase,
      prefix,
    };
  }

  private peek(
    kind: string,
    value?: string,
  ): boolean {
    const token =
      this.tokens[this.index];

    return Boolean(
      token &&
      token.kind === kind &&
      (
        value === undefined ||
        token.value === value
      ),
    );
  }
}

export function parseSearchQuery(
  raw: string,
  options?: {
    readonly limit?: number;
    readonly offset?: number;
  },
): SearchQuery {
  const root =
    new Parser(
      tokenizeSearchQuery(raw),
    ).parse();

  return {
    raw,
    ...(root
      ? { root }
      : {}),
    limit:
      options?.limit ?? 50,
    offset:
      options?.offset ?? 0,
    kinds:
      [],
  };
}
