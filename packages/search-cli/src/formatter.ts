import type {
  UnifiedSearchResponse,
} from "@knowledgeos/search-api";

export function formatSearchCliResponse(
  response:
    UnifiedSearchResponse,
  format:
    | "table"
    | "json"
    | "ndjson",
): string {
  if (format === "json") {
    return JSON.stringify(
      response,
      null,
      2,
    );
  }

  if (format === "ndjson") {
    return response.results
      .map(
        (result) =>
          JSON.stringify(result),
      )
      .join("\n");
  }

  const rows = [
    [
      "Score",
      "Kind",
      "Title",
      "ID",
    ],
    ...response.results.map(
      (result) => [
        result.finalScore
          .toFixed(4),
        result.kind,
        result.title,
        result.searchDocumentId,
      ],
    ),
  ];

  const widths =
    rows[0]!.map(
      (_, column) =>
        Math.max(
          ...rows.map(
            (row) =>
              row[column]?.length ?? 0,
          ),
        ),
    );

  return rows
    .map(
      (row) =>
        row.map(
          (cell, column) =>
            cell.padEnd(
              widths[column] ?? 0,
            ),
        ).join("  "),
    )
    .join("\n");
}
