export interface SearchSnippet {
  readonly text: string;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly matchedTerms: readonly string[];
}

export class SearchSnippetGenerator {
  generate(
    content: string,
    terms: readonly string[],
    maximumLength = 240,
  ): SearchSnippet {
    const normalized = content.toLowerCase();
    const matches = terms
      .map((term) => ({ term, index: normalized.indexOf(term.toLowerCase()) }))
      .filter((value) => value.index >= 0)
      .sort((a, b) => a.index - b.index);

    const anchor = matches[0]?.index ?? 0;
    const start = Math.max(0, anchor - Math.floor(maximumLength / 3));
    const end = Math.min(content.length, start + maximumLength);

    return {
      text: content.slice(start, end),
      startOffset: start,
      endOffset: end,
      matchedTerms: [...new Set(matches.map((value) => value.term))].sort(),
    };
  }

  highlight(snippet: SearchSnippet): string {
    let value = snippet.text;
    for (const term of [...snippet.matchedTerms].sort((a, b) => b.length - a.length)) {
      value = value.replace(
        new RegExp(`(${escapeRegExp(term)})`, "gi"),
        "<mark>$1</mark>",
      );
    }
    return value;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
