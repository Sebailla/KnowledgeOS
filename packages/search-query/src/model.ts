import type {
  SearchDocumentKind,
} from "@knowledgeos/search-domain";

export type SearchBooleanOperator =
  | "and"
  | "or"
  | "not";

export type SearchField =
  | "title"
  | "body"
  | "tag"
  | "author"
  | "language"
  | "kind"
  | "source"
  | "created"
  | "updated";

export interface SearchTermNode {
  readonly type: "term";
  readonly value: string;
  readonly field?: SearchField;
  readonly phrase: boolean;
  readonly prefix: boolean;
}

export interface SearchBooleanNode {
  readonly type: "boolean";
  readonly operator: SearchBooleanOperator;
  readonly children: readonly SearchQueryNode[];
}

export interface SearchRangeNode {
  readonly type: "range";
  readonly field: "created" | "updated";
  readonly from?: string;
  readonly to?: string;
}

export type SearchQueryNode =
  | SearchTermNode
  | SearchBooleanNode
  | SearchRangeNode;

export interface SearchQuery {
  readonly raw: string;
  readonly root?: SearchQueryNode;
  readonly limit: number;
  readonly offset: number;
  readonly kinds: readonly SearchDocumentKind[];
}

export interface SearchFacetBucket {
  readonly value: string;
  readonly count: number;
}

export interface SearchFacetResult {
  readonly field:
    | "kind"
    | "language"
    | "source"
    | "tag"
    | "author";
  readonly buckets:
    readonly SearchFacetBucket[];
}
