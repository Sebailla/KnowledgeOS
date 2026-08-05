export type LocalSearchKind =
  | "document"
  | "book"
  | "paper"
  | "note"
  | "annotation"
  | "bookmark"
  | "workspace";

export interface LocalSearchRecord {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly kind: LocalSearchKind;
  readonly authors: readonly string[];
  readonly tags: readonly string[];
  readonly availability?: string;
  readonly updatedAt: string;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface LocalSearchQuery {
  readonly text: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly kinds?: readonly LocalSearchKind[];
  readonly authors?: readonly string[];
  readonly tags?: readonly string[];
  readonly availability?: readonly string[];
}

export interface LocalSearchHit {
  readonly id: string;
  readonly title: string;
  readonly kind: LocalSearchKind;
  readonly score: number;
  readonly snippet: string;
  readonly highlights: readonly string[];
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface LocalSearchPage {
  readonly items: readonly LocalSearchHit[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly hasNextPage: boolean;
}

export interface LocalSearchIndexStatus {
  readonly state:
    | "ready"
    | "rebuilding"
    | "corrupt"
    | "empty";
  readonly documentCount: number;
  readonly termCount: number;
  readonly version: number;
  readonly updatedAt?: string;
}

export class LocalSearchIndex {
  private readonly records =
    new Map<string, LocalSearchRecord>();

  private version = 1;
  private updatedAt: string | undefined;
  private rebuilding = false;

  public upsert(
    record: LocalSearchRecord,
  ): void {
    this.records.set(record.id, record);
    this.updatedAt =
      new Date().toISOString();
  }

  public delete(id: string): boolean {
    const deleted = this.records.delete(id);

    if (deleted) {
      this.updatedAt =
        new Date().toISOString();
    }

    return deleted;
  }

  public clear(): void {
    this.records.clear();
    this.updatedAt =
      new Date().toISOString();
  }

  public rebuild(
    records: readonly LocalSearchRecord[],
  ): void {
    this.rebuilding = true;
    this.records.clear();

    for (const record of records) {
      this.records.set(record.id, record);
    }

    this.version += 1;
    this.updatedAt =
      new Date().toISOString();
    this.rebuilding = false;
  }

  public status(): LocalSearchIndexStatus {
    const terms = new Set<string>();

    for (const record of this.records.values()) {
      for (
        const token of tokenize(
          `${record.title} ${record.body} ` +
          `${record.authors.join(" ")} ` +
          record.tags.join(" "),
        )
      ) {
        terms.add(token);
      }
    }

    return {
      state:
        this.rebuilding
          ? "rebuilding"
          : this.records.size === 0
            ? "empty"
            : "ready",
      documentCount: this.records.size,
      termCount: terms.size,
      version: this.version,
      ...(this.updatedAt
        ? { updatedAt: this.updatedAt }
        : {}),
    };
  }

  public search(
    query: LocalSearchQuery,
  ): LocalSearchPage {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(
      100,
      Math.max(1, query.pageSize ?? 20),
    );
    const terms = tokenize(query.text);

    const hits = [...this.records.values()]
      .filter((record) =>
        matchesFilters(record, query),
      )
      .map((record) => ({
        record,
        score: score(record, terms),
      }))
      .filter((entry) =>
        terms.length === 0 ||
        entry.score > 0,
      )
      .sort((left, right) =>
        right.score - left.score ||
        right.record.updatedAt.localeCompare(
          left.record.updatedAt,
        ),
      )
      .map(({ record, score }) => ({
        id: record.id,
        title: record.title,
        kind: record.kind,
        score,
        snippet:
          snippet(record.body, terms),
        highlights: terms.filter(
          (term) =>
            normalize(
              `${record.title} ${record.body}`,
            ).includes(term),
        ),
        metadata: record.metadata,
      }));

    const offset = (page - 1) * pageSize;

    return {
      items: hits.slice(
        offset,
        offset + pageSize,
      ),
      page,
      pageSize,
      total: hits.length,
      hasNextPage:
        offset + pageSize < hits.length,
    };
  }

  public suggest(
    prefix: string,
    limit = 8,
  ): readonly string[] {
    const normalized = normalize(prefix);
    const values = new Set<string>();

    for (const record of this.records.values()) {
      for (const value of [
        record.title,
        ...record.authors,
        ...record.tags,
      ]) {
        if (
          normalize(value).split(/[^a-z0-9]+/).some((word) => word.startsWith(normalized))
        ) {
          values.add(value);
        }
      }
    }

    return [...values]
      .sort((left, right) =>
        left.localeCompare(right),
      )
      .slice(0, Math.max(0, limit));
  }
}

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function tokenize(value: string):
readonly string[] {
  return [
    ...new Set(
      normalize(value)
        .split(/[^a-z0-9]+/)
        .filter((token) =>
          token.length > 1,
        ),
    ),
  ];
}

function score(
  record: LocalSearchRecord,
  terms: readonly string[],
): number {
  if (terms.length === 0) {
    return 1;
  }

  const title = normalize(record.title);
  const body = normalize(record.body);
  const authors =
    normalize(record.authors.join(" "));
  const tags =
    normalize(record.tags.join(" "));

  return terms.reduce(
    (total, term) =>
      total +
      (title.includes(term) ? 6 : 0) +
      (tags.includes(term) ? 4 : 0) +
      (authors.includes(term) ? 3 : 0) +
      count(body, term),
    0,
  );
}

function count(
  value: string,
  term: string,
): number {
  let total = 0;
  let index = value.indexOf(term);

  while (index >= 0) {
    total += 1;
    index = value.indexOf(
      term,
      index + term.length,
    );
  }

  return total;
}

function snippet(
  body: string,
  terms: readonly string[],
): string {
  const normalized = normalize(body);
  const first = terms
    .map((term) =>
      normalized.indexOf(term),
    )
    .filter((index) => index >= 0)
    .sort((left, right) =>
      left - right,
    )[0] ?? 0;

  const start = Math.max(0, first - 60);
  const end = Math.min(
    body.length,
    start + 220,
  );

  return (
    (start > 0 ? "…" : "") +
    body.slice(start, end).trim() +
    (end < body.length ? "…" : "")
  );
}

function matchesFilters(
  record: LocalSearchRecord,
  query: LocalSearchQuery,
): boolean {
  if (
    query.kinds?.length &&
    !query.kinds.includes(record.kind)
  ) {
    return false;
  }

  if (
    query.authors?.length &&
    !query.authors.some((author) =>
      record.authors.includes(author),
    )
  ) {
    return false;
  }

  if (
    query.tags?.length &&
    !query.tags.some((tag) =>
      record.tags.includes(tag),
    )
  ) {
    return false;
  }

  if (
    query.availability?.length &&
    (
      !record.availability ||
      !query.availability.includes(
        record.availability,
      )
    )
  ) {
    return false;
  }

  return true;
}
