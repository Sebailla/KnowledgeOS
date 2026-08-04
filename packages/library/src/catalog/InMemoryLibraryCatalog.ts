import type { LibraryCatalog } from "./LibraryCatalog.js";
import type {
  LibraryItemSummary,
  LibraryPage,
  LibraryQuery,
} from "./LibraryCatalogTypes.js";

export class InMemoryLibraryCatalog
implements LibraryCatalog {
  public constructor(
    private readonly items:
      readonly LibraryItemSummary[] = [],
  ) {}

  public async list(
    query: LibraryQuery = {},
  ): Promise<LibraryPage> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(
      100,
      Math.max(1, query.pageSize ?? 24),
    );

    const normalizedText =
      query.text?.trim().toLocaleLowerCase();

    let filtered = this.items.filter(
      (item) => {
        if (
          normalizedText &&
          !matchesText(item, normalizedText)
        ) {
          return false;
        }

        if (
          query.kinds?.length &&
          !query.kinds.includes(item.kind)
        ) {
          return false;
        }

        if (
          query.availability?.length &&
          !query.availability.includes(
            item.availability,
          )
        ) {
          return false;
        }

        if (
          query.favoritesOnly &&
          !item.favorite
        ) {
          return false;
        }

        return true;
      },
    );

    filtered = [...filtered].sort(
      sorter(query.sort ?? "updated-desc"),
    );

    const offset = (page - 1) * pageSize;
    const pageItems = filtered.slice(
      offset,
      offset + pageSize,
    );

    return {
      items: pageItems,
      page,
      pageSize,
      total: filtered.length,
      hasNextPage:
        offset + pageSize < filtered.length,
    };
  }

  public async get(
    id: string,
  ): Promise<LibraryItemSummary | undefined> {
    return this.items.find(
      (item) => item.id === id,
    );
  }

  public async recent(
    limit = 12,
  ): Promise<readonly LibraryItemSummary[]> {
    return [...this.items]
      .sort(
        (left, right) =>
          right.updatedAt.localeCompare(
            left.updatedAt,
          ),
      )
      .slice(0, Math.max(0, limit));
  }

  public async favorites(
    limit = 100,
  ): Promise<readonly LibraryItemSummary[]> {
    return this.items
      .filter((item) => item.favorite)
      .slice(0, Math.max(0, limit));
  }
}

function matchesText(
  item: LibraryItemSummary,
  text: string,
): boolean {
  const haystack = [
    item.title,
    item.subtitle ?? "",
    ...item.authors,
    ...item.tags,
  ]
    .join(" ")
    .toLocaleLowerCase();

  return haystack.includes(text);
}

function sorter(
  sort:
    NonNullable<LibraryQuery["sort"]>,
): (
  left: LibraryItemSummary,
  right: LibraryItemSummary,
) => number {
  switch (sort) {
    case "title-asc":
      return (left, right) =>
        left.title.localeCompare(right.title);

    case "title-desc":
      return (left, right) =>
        right.title.localeCompare(left.title);

    case "created-desc":
      return (left, right) =>
        right.createdAt.localeCompare(
          left.createdAt,
        );

    case "updated-desc":
      return (left, right) =>
        right.updatedAt.localeCompare(
          left.updatedAt,
        );
  }
}
