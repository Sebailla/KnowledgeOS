export type SearchFilter =
  | {
      readonly kind: "metadata";
      readonly field: string;
      readonly value: string | number | boolean;
    }
  | {
      readonly kind: "tag";
      readonly value: string;
    };

export type SearchSort =
  | {
      readonly field: "score";
      readonly direction: "asc" | "desc";
    }
  | {
      readonly field: "updatedAt";
      readonly direction: "asc" | "desc";
    }
  | {
      readonly field: "title";
      readonly direction: "asc" | "desc";
    };

export interface SearchQuery {
  readonly text: string;
  readonly filters: readonly SearchFilter[];
  readonly sort: readonly SearchSort[];
  readonly offset: number;
  readonly limit: number;
}
