export interface SearchToken {
  readonly kind:
    | "word"
    | "phrase"
    | "lparen"
    | "rparen"
    | "colon"
    | "range"
    | "operator";
  readonly value: string;
}

export function tokenizeSearchQuery(
  input: string,
): readonly SearchToken[] {
  const tokens: SearchToken[] = [];
  let index = 0;

  while (index < input.length) {
    const current = input[index];

    if (/\s/.test(current ?? "")) {
      index += 1;
      continue;
    }

    if (current === "(") {
      tokens.push({
        kind: "lparen",
        value: current,
      });
      index += 1;
      continue;
    }

    if (current === ")") {
      tokens.push({
        kind: "rparen",
        value: current,
      });
      index += 1;
      continue;
    }

    if (current === ":") {
      tokens.push({
        kind: "colon",
        value: current,
      });
      index += 1;
      continue;
    }

    if (current === '"') {
      let value = "";
      index += 1;

      while (
        index < input.length &&
        input[index] !== '"'
      ) {
        value += input[index];
        index += 1;
      }

      if (input[index] !== '"') {
        throw new Error(
          "Unterminated search phrase",
        );
      }

      index += 1;
      tokens.push({
        kind: "phrase",
        value,
      });
      continue;
    }

    if (current === "[") {
      let value = "";
      index += 1;

      while (
        index < input.length &&
        input[index] !== "]"
      ) {
        value += input[index];
        index += 1;
      }

      if (input[index] !== "]") {
        throw new Error(
          "Unterminated search range",
        );
      }

      index += 1;
      tokens.push({
        kind: "range",
        value,
      });
      continue;
    }

    let value = "";
    while (
      index < input.length &&
      !/\s/.test(input[index] ?? "") &&
      !["(", ")", ":", '"', "["].includes(
        input[index] ?? "",
      )
    ) {
      value += input[index];
      index += 1;
    }

    const upper = value.toUpperCase();
    if (
      upper === "AND" ||
      upper === "OR" ||
      upper === "NOT"
    ) {
      tokens.push({
        kind: "operator",
        value: upper,
      });
    } else {
      tokens.push({
        kind: "word",
        value,
      });
    }
  }

  return tokens;
}
