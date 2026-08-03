import type {
  SearchQueryNode,
} from "./model.js";

export interface CompiledSearchQuery {
  readonly ftsMatch: string;
  readonly whereSql:
    readonly string[];
  readonly parameters:
    readonly unknown[];
}

function quote(
  value: string,
): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function compileSearchQuery(
  node: SearchQueryNode | undefined,
): CompiledSearchQuery {
  const whereSql: string[] = [];
  const parameters: unknown[] = [];

  function compile(
    current: SearchQueryNode,
  ): string {
    if (current.type === "range") {
      if (current.from) {
        whereSql.push(
          `${current.field}_at >= ?`,
        );
        parameters.push(
          current.from,
        );
      }

      if (current.to) {
        whereSql.push(
          `${current.field}_at <= ?`,
        );
        parameters.push(
          current.to,
        );
      }

      return "";
    }

    if (current.type === "boolean") {
      const compiled =
        current.children
          .map(compile)
          .filter(Boolean);

      if (
        current.operator === "not"
      ) {
        const child =
          compiled[0] ?? "";
        return child
          ? `NOT (${child})`
          : "";
      }

      const separator =
        current.operator === "and"
          ? " AND "
          : " OR ";

      return compiled.length > 1
        ? `(${compiled.join(separator)})`
        : compiled[0] ?? "";
    }

    const value =
      current.phrase
        ? quote(current.value)
        : current.prefix
          ? `${quote(current.value)}*`
          : quote(current.value);

    const fieldMap:
      Readonly<Record<string, string>> = {
        title: "title",
        body: "body",
        tag: "tags",
        author: "authors",
      };

    if (
      current.field &&
      fieldMap[current.field]
    ) {
      return `${fieldMap[current.field]}:${value}`;
    }

    if (
      current.field === "kind" ||
      current.field === "language" ||
      current.field === "source"
    ) {
      whereSql.push(
        `${current.field} = ?`,
      );
      parameters.push(
        current.value,
      );
      return "";
    }

    return value;
  }

  const ftsMatch =
    node
      ? compile(node)
      : "";

  return {
    ftsMatch,
    whereSql,
    parameters,
  };
}
