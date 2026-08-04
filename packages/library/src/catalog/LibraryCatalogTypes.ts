export type LibraryAvailability =
  | "local"
  | "master-library"
  | "both"
  | "unavailable";

export type LibraryItemKind =
  | "book"
  | "paper"
  | "document"
  | "web"
  | "note";

export type LibrarySort =
  | "title-asc"
  | "title-desc"
  | "updated-desc"
  | "created-desc";

export interface LibraryItemSummary {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly authors: readonly string[];
  readonly kind: LibraryItemKind;
  readonly availability: LibraryAvailability;
  readonly favorite: boolean;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly coverURL?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface LibraryQuery {
  readonly text?: string;
  readonly kinds?: readonly LibraryItemKind[];
  readonly availability?: readonly LibraryAvailability[];
  readonly favoritesOnly?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
  readonly sort?: LibrarySort;
}

export interface LibraryPage {
  readonly items: readonly LibraryItemSummary[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly hasNextPage: boolean;
}
