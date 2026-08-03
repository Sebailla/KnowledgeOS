export function normalizeSearchText(
  value: string,
): string {
  return value
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSearchTerms(
  values: readonly string[],
): readonly string[] {
  return [
    ...new Set(
      values
        .map(normalizeSearchText)
        .filter(Boolean),
    ),
  ].sort(
    (a, b) =>
      a.localeCompare(b),
  );
}
