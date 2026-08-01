import type {
  AuthorityScope,
  IdentityReference,
  Page,
  PageRequest,
} from "@knowledgeos/domain-types";
import type { Query } from "./query.js";

export type SearchScope =
  | "local-library"
  | "master-catalog"
  | "personal-knowledge"
  | "knowledge-graph";

export interface SearchParameters extends PageRequest {
  readonly text: string;
  readonly scopes: readonly SearchScope[];
  readonly includeDerived?: boolean;
}

export type SearchQuery = Query<
  "search.execute",
  SearchParameters
>;

export interface SearchResult {
  readonly target: IdentityReference;
  readonly title: string;
  readonly snippet?: string;
  readonly authority: AuthorityScope;
  readonly score: number;
  readonly componentScores?: Readonly<Record<string, number>>;
  readonly provenance?: readonly string[];
}

export type SearchResultPage = Page<SearchResult>;
